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

        return this.getTokens(user.id, user.email);
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

        return this.getTokens(user.id, user.email);
    }

    async getTokens(userId: number, email: string,) {
        const payload = {
            sub: userId,
            email,
        }

        const [at, rt] = await Promise.all([
            this.jwt.signAsync(payload, {
              secret: this.config.get<string>('AT_JWT_SECRET'),
              expiresIn: '15m',
            }),
            this.jwt.signAsync(payload, {
              secret: this.config.get<string>('RT_JWT_SECRET'),
              expiresIn: '7d',
            }),
          ]);

        return {
            access_token: at,
            refresh_token: rt,
          };
    }

    async logout(userId: number) {
        await this.prisma.user.updateMany({
          where: {
            id: userId,
            hashedRt: {
              not: null,
            },
          },
          data: {
            hashedRt: null,
          },
        });
        return true;
      }
    
      async refreshTokens(userId: number, rt: string) {
        const user = await this.prisma.user.findUnique({
          where: {
            id: userId,
          },
        });
        if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');
    
        const rtMatches = await argon.verify(user.hashedRt, rt);
        if (!rtMatches) throw new ForbiddenException('Access Denied');
    
        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRtHash(user.id, tokens.refresh_token);
    
        return tokens;
      }

      async updateRtHash(userId: number, rt: string) {
        const hash = await argon.hash(rt);
        await this.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            hashedRt: hash,
          },
        });
      }
}