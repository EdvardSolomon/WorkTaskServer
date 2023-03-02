import { Controller, Post, UseInterceptors, UploadedFile, Get, Res, StreamableFile, Delete, Patch, UseGuards} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { diskStorage } from 'multer';
import { createReadStream } from 'fs';
import { join } from 'path';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('file')
export class FileController {
    constructor(private fileService: FileService){}

@Post('/upload')
@UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
        destination: 'uploads/',
        filename: (req, file , callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            callback(null, file.originalname + '-' + uniqueSuffix)
        }
    })
})
)

uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
}



      @Get()

      getFile(): StreamableFile {
        const file = createReadStream(join('uploads/', 'package.json-1677675775615-146265081'));
        return new StreamableFile(file);
      }


      @Patch()
      patchFile(){}


      @Delete()
      deleteFile(){}

}