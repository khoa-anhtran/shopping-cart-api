import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import type { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
import { JwtAuthGuard } from '../auth-strategy/jwt-auth.guard';
import { MainGuard } from '../auth-strategy/main.guard';
import type { MyRequest } from 'src/types/server';
import { OAuth2Client, TokenPayload } from 'google-auth-library';

@Controller('/auth')
export class AuthController {
    private readonly cookieName: string;
    private readonly isProd: boolean;
    private readonly googleClient: OAuth2Client

    constructor(private auth: AuthService, private cfg: ConfigService) {
        this.cookieName = cfg.get<string>('COOKIE_NAME', 'refresh_token')!;
        this.isProd = cfg.get<string>('NODE_ENV') === 'production';
        this.googleClient = new OAuth2Client(
            {
                clientId: cfg.get<string>('GOOGLE_CLIENT_ID'),
                clientSecret: cfg.get<string>('GOOGLE_CLIENT_SECRET'),
                redirectUri: 'postmessage',
            }
        );
    }

    @Post('register')
    async register(@Body() dto: RegisterDto, @Res() res: Response) {
        const { user, accessToken, refreshToken } = await this.auth.register(dto);

        res.cookie(this.cookieName, refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: this.isProd,
            maxAge: 1000 * 60 * 60 * 24 * 30,
            path: '/auth/refresh',
        });

        return res.json({ accessToken, user });
    }

    @Post('login')
    async login(@Body() dto: LoginDto, @Res() res: Response) {
        const { user, accessToken, refreshToken } = await this.auth.login(dto.email, dto.password);

        res.cookie(this.cookieName, refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: this.isProd,
            maxAge: 1000 * 60 * 60 * 24 * 30,
            path: '/auth/refresh',
        });

        return res.json({ accessToken, user });
    }

    @UseGuards(MainGuard)
    @Get('me')
    async me(@Req() req: MyRequest) {
        const user = req.user as { userId: string; email: string; };
        return { user };
    }

    @Post('google')
    async verifyGoogleLogin(@Req() req: Request, @Res() res: Response) {
        try {
            const { tokens } = await this.googleClient.getToken(req.body.code);

            if (!tokens.id_token)
                throw new Error("missing id token")

            const ticket = await this.googleClient.verifyIdToken({
                idToken: tokens.id_token,
                audience: this.cfg.get<string>("GOOGLE_CLIENT_ID"),
            });

            if (!ticket)
                throw new Error("missing login ticket")

            const { email, name, picture, sub } = ticket.getPayload() as TokenPayload

            if (!email || !name || !sub)
                throw new Error("missing payload")

            const { accessToken, refreshToken, user } = await this.auth.googleLogin(email, name, sub, picture)

            res.cookie(this.cookieName, refreshToken, {
                httpOnly: true,
                sameSite: 'lax',
                secure: this.isProd,
                maxAge: 1000 * 60 * 60 * 24 * 30,
                path: '/auth/refresh',
            });

            return res.json({ accessToken, user });
        }
        catch (err) {
            console.error('Google login error:', err);
            throw new UnauthorizedException('Invalid Google authorization code');
        }
    }

    @Post('refresh')
    async refresh(@Req() req: Request) {
        const refreshToken = req.cookies?.refresh_token

        const data = await this.auth.refresh(refreshToken)

        return data;
    }

    @UseGuards(MainGuard)
    @Post('logout')
    async logout(@Res() res: Response) {
        res.clearCookie(this.cookieName, { httpOnly: true, sameSite: 'lax', secure: this.isProd, path: "/auth/refresh" });
        return res.json({ ok: true });
    }
}
