import { Injectable, ForbiddenException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto, GoogleAuthDto } from "./dto";
import * as argon from 'argon2';
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config/dist";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService
        ){}


    async validateUser(details: GoogleAuthDto){

        const user = await this.prisma.user.findUnique({
            where: {
                email: details.email,
            },
        });

        if(user) return user;
        const newUser = await this.prisma.user.create({
            data:{
                email: details.email,
                firstName: details.firstName,
              lastName: details.lastName,
            }
        });

        await this.prisma.folder.create({
            data : {
                folderName: "Root",
                view: 'private',
                userId: newUser.id,
            }
        })

        return newUser;

    }

    async signup(dto : AuthDto){

        const hash = await argon.hash(dto.password);

        try {
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                hash,
            },
        });

        return this.signToken(user.id, user.email);
    } catch(error) {
        if(error instanceof Prisma.PrismaClientKnownRequestError) {
            if(error.code === 'P2002') {
                throw new ForbiddenException('Credentials taken');
            }
        }
        throw error;
    }
    }

    async signin(dto: AuthDto){

        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });

        if(!user) throw new ForbiddenException("Credentials incorect, cant find user");

        const pwMatches = await argon.verify(user.hash,dto.password);

        if(!pwMatches) throw new ForbiddenException("Password incorect");

        return this.signToken(user.id, user.email);
    }

    async signToken(userId: number, email: string,): Promise<{access_token: string}> {
        const payload = {
            sub: userId,
            email,
        }
        const secret = this.config.get('JWT_SECRET');

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: secret,
        });

        return {
            access_token: token,
        };
    }
}