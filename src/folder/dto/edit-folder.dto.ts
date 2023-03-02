import { IsOptional, IsString } from "class-validator";

export class EditFolderDto {

    @IsString()
    @IsOptional()
    folderName: string

    @IsString()
    @IsOptional()
    view: string
};