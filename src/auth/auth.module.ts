import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy, GoogleSrtategy } from "./strategy";
import { SessionSerializer } from "./utils/Serializer";
import { UserService } from "src/user/user.service";

@Module({    
    imports: [JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, SessionSerializer ,GoogleSrtategy, UserService],
})
export class AuthModule {


}