import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFileDto } from './dto';
import { EditFileDto } from './dto';
import  { unlink } from 'fs';

@Injectable()
export class FileService {
constructor(private prisma: PrismaService){}

    getFiles() {
        return this.prisma.file.findMany()
    }

    async getFileById(fileId: number) {
        return await this.prisma.file.findFirst({
            where:{
                id: fileId,
            }
        })
    }

    getFilesByFolderId(folderId: number) {
        return this.prisma.file.findMany({
            where:{
                folderId,
            }
        })
    }

    getFilesByUserId(userId: number) {
        return this.prisma.file.findMany({
            where:{
                userId,
            }
        })
    }

    async createFile(userId: number, dto: CreateFileDto) {
        const post = await this.prisma.file.create({
            data: {
                userId,
                fileName: dto.fileName,
                folderId: dto.folderId,
                view: dto.view,
                destination: dto.destination,
                originalName: dto.originalName,
                path: dto.path,
                size: dto.size,
            }
          });

        return post;
    }

    async editFile(fileId: number, dto: EditFileDto) {

        return this.prisma.file.update({
            where: {
                id: fileId,
            },
            data: {
                ...dto,
            }
        })

    }
    
    async deleteFileById(fileId: number) {

    const deletedFile = await this.prisma.file.delete({
        where: {
            id: fileId,
        }
    });

    const path = deletedFile.path;

    unlink(path, (err) => {
            if (err) {
                console.error(err);
                return err;
            }

        }
        );

    return deletedFile
}
}