import { Module } from '@nestjs/common';
import { FileModule } from './file/file.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './user/user.module';
import { FolderModule } from './folder/folder.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true,}), AuthModule, 
  FileModule, FolderModule, PrismaModule, UserModule,PassportModule.register({ session: true })],
})
export class AppModule {}
 