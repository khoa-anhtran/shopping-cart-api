import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { BearerStrategy } from 'passport-azure-ad';
import { ReqUserPayload } from 'src/types/server';
import { AccountProvider } from 'src/users/user.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AzureAdStrategy extends PassportStrategy(BearerStrategy, 'oauth-bearer') {
    constructor(cfg: ConfigService, private usersService: UsersService) {
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

        const user = await this.usersService.findByEmail(email)

        let userId: string

        if (!user) {
            const newUser = await this.usersService.create({ email, name, provider: AccountProvider.MICROSOFT })
            userId = newUser.id
        }
        else
            userId = user.id

        // This return value becomes `req.user`
        return {
            sub: token.sub,
            tid: token.tid,
            userId,
            name,
            email,
        } as ReqUserPayload;
    }
}
