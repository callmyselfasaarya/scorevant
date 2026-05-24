import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') ||
        configService.get<string>('SUPABASE_JWT_SECRET') ||
        'dev-secret-change-in-production',
    });
  }

  validate(payload: { sub: string; email: string }) {
    // The payload contains the decoded JWT. For Supabase, the user ID is in the 'sub' field.
    return { userId: payload.sub, email: payload.email };
  }
}
