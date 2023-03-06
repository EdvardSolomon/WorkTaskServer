import { IsOptional, IsString } from "class-validator";

export class EditFileDto {

    @IsString()
    @IsOptional()
    originalName: string

    @IsString()
    @IsOptional()
    view: string
};