import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/types/auth';

function cookieExtractor(req: Request): string | null {
    const name = process.env.COOKIE_NAME || 'access_token';
    return req?.cookies?.[name] ?? null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(cfg: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                cookieExtractor,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: cfg.getOrThrow<string>('JWT_SECRET'), // ← never undefined
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: JwtPayload) {
        // get raw token from Authorization header
        const auth = req.headers['authorization'];
        const token = auth?.startsWith('Bearer ')
            ? auth.slice(7)
            : null;

        // you can add token into returned user object
        return {
            userId: payload.sub,
            email: payload.email,
            token,                // now available in request.user.token
        };
    }
}
