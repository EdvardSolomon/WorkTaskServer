import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class GoogleAuthDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    firstName: string;
    
    @IsString()
    @IsNotEmpty()
    lastName: string;
}