import { Body, Controller, HttpCode, HttpStatus, Post, Get, UseGuards, Session } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { GoogleAuthGuard } from "./guard/google.guard";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Get('google/login')
    @UseGuards(GoogleAuthGuard)
    handleLogin(){
        return { msg:'Google Authentication' }
    }

    @Get('google/redirect')
    @UseGuards(GoogleAuthGuard)
    handleRedirect(@Session() session: Record<string, any>){

        const userId = session.passport.user.id;
        const email = session.passport.user.email;

        return this.authService.signToken(userId,email);
    }

    @Post('signup')

    signup(@Body() dto: AuthDto){
        return this.authService.signup(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('signin')

    signin(@Body() dto: AuthDto){
        return this.authService.signin(dto);
    }
}