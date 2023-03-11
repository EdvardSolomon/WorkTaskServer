import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { OAuth2Client } from 'google-auth-library';
import { JwtStrategy, RtStrategy } from "./strategy";
import { UserService } from "src/user/user.service";

@Module({    
    imports: [JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, RtStrategy, UserService, OAuth2Client],
})
export class AuthModule {


}