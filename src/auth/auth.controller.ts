import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Res, HttpException, Req, Get } from "@nestjs/common";
import { Response, Request } from 'express';
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { ApiTags, ApiCreatedResponse, ApiOperation, ApiUnauthorizedResponse, ApiBadRequestResponse, ApiOkResponse } from "@nestjs/swagger";
import { GetUser } from "./decorator";
import { RtGuard, JwtGuard } from "./guard";

@ApiTags("Auth")

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}


    @Post('google/login')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Google Authentication' })

    async handleLogin(
      @Res({ passthrough: true }) response: Response,
      @Body("token") token : string,
      ){

        const result = await this.authService.loginGoogleUser(token);
          if (result) {
            response.cookie('refreshToken', result.tokens.refresh_token, {maxAge: 900000, httpOnly: true});
            return {token : result.tokens.access_token, user : result.user};
          } else {
            throw new HttpException(
              {
                status: HttpStatus.UNAUTHORIZED,
                error: 'Error while logging in with google',
              },
              HttpStatus.UNAUTHORIZED,
            );
          }
    }

    @UseGuards(RtGuard)
    @Get('refresh')
    @ApiOperation({ summary: 'Refresh tokens' })
    @ApiUnauthorizedResponse({
        description: "Unauthorized"
    })
    @ApiOkResponse({
        description: 'Refreshed tokens successfully',
    })
    @HttpCode(HttpStatus.OK)
    async refreshTokens(
      @GetUser('sub') userId: number, 
      @Req() request: Request,
      @Res({ passthrough: true }) response: Response,
    ) {
      try {
        const { refreshToken }= request.cookies;
        const result = await this.authService.refreshTokens(userId, refreshToken);
        response.cookie("refreshToken",  result.tokens.refresh_token, {maxAge: 900000, httpOnly: true})
        return {token : result.tokens.access_token, user : result.user};
      } catch (error) {
        console.log("error");
        console.log(error);
        return response.statusCode = 403;
      }

    }

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create local user' })
    @ApiCreatedResponse({
        description: 'Created user and return tokens',
    })

    @ApiBadRequestResponse({
        description: 'Expect status 400 on empty email, or email not email, or empty password',
    })

    signup(@Body() dto: AuthDto){
        return this.authService.signup(dto);
    }

    @Post('signin')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'User local Login' })
    @ApiOkResponse({
        description: 'Comfirmed signin and return tokens',
    })

    @ApiBadRequestResponse({
        description: 'Expect status 400 on empty email, or email not email, or empty password',
    })
    signin(@Body() dto: AuthDto){
        return this.authService.signin(dto);
    }

    @Post('logout')
    @UseGuards(JwtGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'User Logout' })
    @ApiUnauthorizedResponse({
        description: "Unauthorized"
    })
    @ApiOkResponse({
        description: 'Logout successfully',
    })
    logout(@GetUser('sub') userId: number,){
        return this.authService.logout(userId);
    }
  }