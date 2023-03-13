import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'
import { Request } from 'express';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) =>{
        return request?.cookies?.refreshToken;
      }]),
      secretOrKey: config.get('RT_JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload) {
    const refreshToken = request.cookies?.refreshToken;
    
    if (!refreshToken) throw new ForbiddenException('Refresh token malformed');

    return {
      ...payload,
      refreshToken,
    };
  }
}