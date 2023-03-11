import { Body, Controller, HttpCode, HttpStatus, Post, Get, UseGuards, Session, Res, Req, HttpException } from "@nestjs/common";
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

    async handleLogin(@Body("token") token : string){

        console.log(token);

        const result = await this.authService.loginGoogleUser(token);
          if (result) {
            return result;
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
    @Post('refresh')
    @ApiOperation({ summary: 'Refresh tokens' })
    @ApiUnauthorizedResponse({
        description: "Unauthorized"
    })
    @ApiOkResponse({
        description: 'Refreshed tokens successfully',
    })
    @HttpCode(HttpStatus.OK)
    refreshTokens(
      @GetUser('sub') userId: number,
      @Body('refresh_token') refreshToken: string,
    ) {
        console.log(refreshToken);
      return this.authService.refreshTokens(userId, refreshToken);
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