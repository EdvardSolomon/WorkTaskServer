import { Body, Controller, HttpCode, HttpStatus, Post, Get, UseGuards, Session, ParseIntPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { GoogleAuthGuard } from "./guard/google.guard";
import { ApiTags, ApiCreatedResponse, ApiOperation, ApiAcceptedResponse, ApiUnauthorizedResponse, ApiBadRequestResponse, ApiOkResponse, ApiMovedPermanentlyResponse } from "@nestjs/swagger";
import { GetUser } from "./decorator";
import { RtGuard, JwtGuard } from "./guard";

@ApiTags("Auth")

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}


    @Get('google/login')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Google Authentication' })
    @UseGuards(GoogleAuthGuard)

    handleLogin(){
        return { msg:'Google Authentication' }
    }

    @Get('google/redirect')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Google redirect' })
    @ApiOkResponse({
        description: "Successfully Google Authentication",
    })
    @UseGuards(GoogleAuthGuard)

    async handleRedirect(@Session() session: Record<string, any>){

        const userId = session.passport.user.id;
        const email = session.passport.user.email;

        const tokens = await this.authService.getTokens(userId,email);
        this.authService.updateRtHash(userId, tokens.refresh_token);
        return tokens;
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
      @GetUser('refreshToken') refreshToken: string,
    ) {
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