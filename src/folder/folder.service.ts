import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFolderDto } from './dto';
import { EditFolderDto } from './dto';
import { existsSync, mkdirSync, rmdirSync } from 'fs';

@Injectable()
export class FolderService {
    constructor(private prisma: PrismaService){}

    getFolders() {
        return this.prisma.folder.findMany()
    }

    getFolderById(PostId: number) {
        return this.prisma.folder.findFirst({
            where:{
                id: PostId,
            }
        })
    }

    getFoldersByAuthorId(userId: number) {
        return this.prisma.folder.findMany({
            where:{
                userId,
            }
        })
    }

    async createFolder(userId: number, dto: CreateFolderDto) {
        const post = await this.prisma.folder.create({
            data: {
                userId,
                folderName: dto.folderName,
                parentId: dto.parentId,
                view: dto.view,
            }
          });

          const folderId = post.id;
          const dir = `./uploads/${userId}/${folderId}`;
          if (!existsSync(dir)) {
              mkdirSync(dir, { recursive: true });
          }

        return post;
    }

    async editFolder(folderId: number, dto: EditFolderDto) {

        return this.prisma.folder.update({
            where: {
                id: folderId,
            },
            data: {
                ...dto,
            }
        })

    }
    
    async deleteFolderById(userId: number, folderId: number) {


        const dir = `./uploads/${userId}/${folderId}`;
        if (existsSync(dir)) {
            rmdirSync(dir, { recursive: true });
        }

        await this.prisma.folder.delete({
            where: {
                id: folderId,
            }
        })
        
    }

}