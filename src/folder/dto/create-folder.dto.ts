
import { IsNotEmpty, IsOptional, IsString, IsNumber } from "class-validator"

export class CreateFolderDto {

    @IsNumber()
    userId: number

    @IsString()
    @IsNotEmpty()
    folderName: string

    @IsString()
    @IsNotEmpty()
    view: string

    @IsString()
    @IsNotEmpty() 
    @IsOptional()
    parentId: number
};