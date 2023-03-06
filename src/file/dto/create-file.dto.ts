import { IsNotEmpty, IsOptional, IsString, IsNumber } from "class-validator"

export class CreateFileDto {

    @IsNumber()
    userId: number

    @IsString()
    @IsNotEmpty()
    fileName: string

    @IsString()
    @IsNotEmpty()
    view: string

    @IsString()
    @IsNotEmpty() 
    @IsOptional()
    folderId: number

    @IsString()
    @IsNotEmpty() 
    originalName: string

    @IsString()
    @IsNotEmpty() 
    destination: string

    @IsString()
    @IsNotEmpty() 
    path: string

    @IsNumber()
    @IsNotEmpty() 
    size: number
};