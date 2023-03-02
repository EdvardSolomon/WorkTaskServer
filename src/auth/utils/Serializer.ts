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
        console.log("Serialize User");
        console.log(user);
        done(null, user)
    } 

    async deserializeUser(payload: any, done:Function){

   //    const user = await this.userService.getUserById(payload.id);
        console.log('Deserialize User');
        console.log(payload);
   //     return user ? done(null, user) : done(null, null);
        done(null, payload)
    }
     
}