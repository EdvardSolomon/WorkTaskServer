import { Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { Body, Req } from '@nestjs/common/decorators/http/route-params.decorator';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { CreateFolderDto } from './dto';
import { EditFolderDto } from './dto/edit-folder.dto';
import { FolderService } from './folder.service';
import { Request } from 'express';


@UseGuards(JwtGuard)

@Controller('folders')
export class FolderController {
    constructor(private folderService: FolderService){}

    @Get() 
    getFolders(@Req() request: Request) {

        console.log(request);

        return this.folderService.getFolders()
    }

    @Post()

    createFolder(
        @GetUser('id') userId: number,
        @Body() dto: CreateFolderDto
    ){
        return this.folderService.createFolder(userId, dto);
    }

    @Get(':id')

    getFolderById(
        @Param('id', ParseIntPipe) folderId: number,
        ){
            return this.folderService.getFolderById(folderId)
        }

    @Get('/author/:id')

    getFoldersByAuthorId(
        @Param('id', ParseIntPipe) userId: number,
        ){
            return this.folderService.getFoldersByAuthorId(userId)
        } 

    @Patch(':id')

    editFolder(
        @Param('id', ParseIntPipe) folderId: number,
        @Body() dto: EditFolderDto,
    ){
        return this.folderService.editFolder(folderId, dto);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')

    deleteFolderById(
        @Param('id', ParseIntPipe) folderId: number,
    ){
        return this.folderService.deleteFolderById(folderId)
    }
}