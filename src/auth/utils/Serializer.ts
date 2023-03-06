import { PassportSerializer } from "@nestjs/passport";
import { User } from "@prisma/client";
import { UserService } from "../../user/user.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SessionSerializer extends PassportSerializer {

    constructor(private userService: UserService){
        super()
    }

    serializeUser(user: User, done: Function){
        done(null, user)
    } 

    async deserializeUser(payload: any, done:Function){
        done(null, payload)
    }
     
}