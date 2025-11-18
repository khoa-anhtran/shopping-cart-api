import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { BearerStrategy } from 'passport-azure-ad';

@Injectable()
export class AzureAdStrategy extends PassportStrategy(BearerStrategy, 'oauth-bearer') {
    constructor(cfg: ConfigService) {
        super({
            identityMetadata:
                'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',
            validateIssuer: false,
            clientID: cfg.getOrThrow<string>('AZURE_AD_CLIENT_ID'),
            audience: cfg.getOrThrow<string>('AZURE_AD_CLIENT_ID'),
            passReqToCallback: false,
            loggingLevel: 'warn',
            loggingNoPII: true,
        });
    }

    async validate(token: any) {
        // Same logic as your Express verify callback
        if (!token.scp && !token.roles) {
            throw new UnauthorizedException(
                'No delegated or app permission claims found',
            );
        }

        const name =
            token.name ??
            (token.given_name && token.family_name
                ? `${token.given_name} ${token.family_name}`
                : undefined);

        const email =
            (Array.isArray(token.emails) ? token.emails[0] : undefined) ??
            token.email ??
            token.preferred_username;

        // This return value becomes `req.user`
        return {
            sub: token.sub,
            tid: token.tid,
            name,
            email,
        };
    }
}
