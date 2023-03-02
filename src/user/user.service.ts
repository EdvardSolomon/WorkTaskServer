import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async editUser(userId: number, dto: EditUserDto){
        const user = await this.prisma.user.update({
            where: {
                id: userId
            },
            data:{
                ...dto
            },
        });

        delete user.hash;

        return user;
    }

    async deleteUser(userId: number) {

        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if(!user) {
            throw new NotFoundException("Cant find user");
        }

        await this.prisma.user.delete({
            where: {
                id: userId,
            }
        })
        
    }

    async getUserById(userId: number){
        const user = await this.prisma.user.findFirst({
            where:{
                id: userId,
            }
        });
        return user;
    }
} 