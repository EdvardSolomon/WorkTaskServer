import { Controller, Post, UseInterceptors, UploadedFile, Get, StreamableFile, Delete, Patch, UseGuards, Body, Param, ParseIntPipe} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { diskStorage } from 'multer';
import { createReadStream} from 'fs';
import { join } from 'path';
import { JwtGuard } from 'src/auth/guard';
import { ApiTags, ApiUnauthorizedResponse, ApiBearerAuth, ApiOperation, ApiConsumes, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiNoContentResponse } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator';
import { CreateFileDto, EditFileDto, FileDto } from './dto';
import { File } from '@prisma/client';
@ApiTags("File")
@ApiBearerAuth('JWT')
@ApiUnauthorizedResponse({
    description: 'Unauthorized',
})

@UseGuards(JwtGuard)
@Controller('file')
export class FileController {
    constructor(private fileService: FileService){}

@Post('/upload/:folderId')
@ApiConsumes('multipart/form-data')
@ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
@ApiOperation({ summary: 'Upload file to server by folderId',})
@ApiCreatedResponse({
    description: 'File created',
    type: FileDto,
})
@UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
        destination: function (req : any, file, cb) {
            console.log(req.params);
            const userId = req.user.id;
            const folderId = req.params.folderId;
            const dir = `./uploads/${userId}/${folderId}`;
            cb(null, dir)
          },
         filename: (req, file , callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            callback(null, file.originalname + '-' + uniqueSuffix)
        }
    })
})
)

uploadFile(@UploadedFile() file: Express.Multer.File, @Param('folderId', ParseIntPipe) folderId: number,
@GetUser('id') userId: number,) {
    const dto : CreateFileDto = {
        userId,
        fileName: file.filename,
        view: "private", 
        folderId,
        originalName: file.originalname,
        destination: file.destination,
        path: file.path,
        size: file.size,
    }
    return this.fileService.createFile(userId, dto);
}



    @Get()
    @ApiOperation({ summary: 'Get file by path and name' })
    @ApiOkResponse({
        description: 'Get file by path and name',
        type: FileDto,
    })
    getFile(@Body() dto): StreamableFile {

    const {destination, fileName} = dto;

    const file = createReadStream(join(destination, fileName));

    return new StreamableFile(file);
    }

    @Get('/folder/:id')
    @ApiOperation({ summary: 'Get all files in folder by folderId' })
    @ApiOkResponse({
        description: 'Get all files by folderId',
        type: FileDto,
    })
    getFilesByFolderId(@Param('id', ParseIntPipe) folderId: number) {
        return this.fileService.getFilesByFolderId(folderId);
    }


    @Get('/all')
    @ApiOperation({ summary: 'Get all files' })
    @ApiOkResponse({
        description: 'Get all files',
        type: [FileDto],
    })
    getAllFiles() {
        return this.fileService.getFiles();
    }

    @Get('/user/:id')
    @ApiOperation({ summary: 'Get all files by user by userId' })
    @ApiOkResponse({
        description: 'Get all files by userId',
        type: [FileDto],
    })
    getAllFilesByUserId(@Param('id', ParseIntPipe) userId: number ) {

        return this.fileService.getFilesByUserId(userId);
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Get file by id' })
    @ApiOkResponse({
        description: 'Get file by id',
        type: FileDto,
    })
    async getFileById(@Param('id', ParseIntPipe) fileId: number ) {

        const file: File = await this.fileService.getFileById(fileId);

        const {destination, fileName} = file;

        const streamFile = createReadStream(join(destination, fileName));
    
        return new StreamableFile(streamFile);
    }

    @Patch('/:id')
    @ApiOperation({ summary: 'Edit file by id' })
    @ApiOkResponse({
        description: 'return file',
        type: FileDto,
    })
    patchFile(@Body() dto: EditFileDto, @Param('id', ParseIntPipe) fileId: number){

        return this.fileService.editFile(fileId, dto);
    }

    @Delete('/:id')
    @ApiOperation({ summary: 'Delete file by id' })
    @ApiNoContentResponse({
        description:'Deleted successfully'
    })
    
    deleteFile(@Param('id', ParseIntPipe) fileId: number){
        
        return this.fileService.deleteFileById(fileId);
    }
}