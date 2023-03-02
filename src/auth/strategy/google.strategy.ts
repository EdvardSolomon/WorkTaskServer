import { Injectable, Inject } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-google-oauth20";
import { AuthService } from "../auth.service";

@Injectable()
export class GoogleSrtategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService){
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: 'http://localhost:3000/auth/google/redirect',
            scope: ['profile', 'email'],
        });
    }

    async validate(accessToken:string, refreshToken: string, profile: Profile){

        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);

       const user = await this.authService.validateUser({
            email: profile.emails[0].value,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
        });

        return user || null;
    }
}