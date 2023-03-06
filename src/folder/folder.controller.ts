import { Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { Body, Req } from '@nestjs/common/decorators/http/route-params.decorator';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { CreateFolderDto, FolderDto } from './dto';
import { EditFolderDto } from './dto/edit-folder.dto';
import { FolderService } from './folder.service';
import { Request } from 'express';
import { ApiTags, ApiBearerAuth, ApiUnauthorizedResponse, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiNoContentResponse } from '@nestjs/swagger';

@ApiTags("Folder")
@ApiBearerAuth('JWT')
@ApiUnauthorizedResponse({
    description: 'Unauthorized',
    //type: Error401,
})

@UseGuards(JwtGuard)

@Controller('folders')
export class FolderController {
    constructor(private folderService: FolderService){}

    @Post()
    @ApiOperation({ summary: 'Create folder' })
    @ApiCreatedResponse({
        description: 'Folder created',
        type: FolderDto,
    })
    createFolder(
        @GetUser('id') userId: number,
        @Body() dto: CreateFolderDto
    ){
        return this.folderService.createFolder(userId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all folders' })
    @ApiOkResponse({
        description: 'Get all folders',
        type: [FolderDto],
    })
    getFolders(@Req() request: Request) {

        console.log(request);

        return this.folderService.getFolders()
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Get folder by id' })
    @ApiOkResponse({
        description: 'Get folder by id',
        type: FolderDto,
    })
    getFolderById(
        @Param('id', ParseIntPipe) folderId: number,
        ){
            return this.folderService.getFolderById(folderId)
        }

    @Get('/author/:id')
    @ApiOperation({ summary: 'Get all folders by user' })
    @ApiOkResponse({
        description: 'Get all folders by user',
        type: [FolderDto],
    })
    getFoldersByAuthorId(
        @Param('id', ParseIntPipe) userId: number,
        ){
            return this.folderService.getFoldersByAuthorId(userId)
        } 

    @Patch('/:id')
    @ApiOperation({ summary: 'Edit folder' })
    @ApiOkResponse({
        description: 'return folder',
        type: FolderDto,
    })
    editFolder(
        @Param('id', ParseIntPipe) folderId: number,
        @Body() dto: EditFolderDto,
    ){
        return this.folderService.editFolder(folderId, dto);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('/:id')
    @ApiOperation({ summary: 'Delete folder' })
    @ApiNoContentResponse({
        description:'Deleted successfully'
    })
    
    deleteFolderById(
        @Param('id', ParseIntPipe) folderId: number,
        @GetUser('id') userId: number
    ){
        return this.folderService.deleteFolderById(userId, folderId);
    }
}