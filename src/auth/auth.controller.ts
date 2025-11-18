import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
import { JwtAuthGuard } from '../auth-strategy/jwt-auth.guard';
import { MainGuard } from '../auth-strategy/main.guard';

@Controller('/auth')
export class AuthController {
    private readonly cookieName: string;
    private readonly isProd: boolean;

    constructor(private auth: AuthService, cfg: ConfigService) {
        this.cookieName = cfg.get<string>('COOKIE_NAME', 'refresh_token')!;
        this.isProd = cfg.get<string>('NODE_ENV') === 'production';
    }

    @Post('register')
    async register(@Body() dto: RegisterDto, @Res() res: Response) {
        const { user, accessToken, refreshToken } = await this.auth.register(dto);
        const { id: userId, email, name } = user

        res.cookie(this.cookieName, refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: this.isProd,
            maxAge: 1000 * 60 * 60 * 24 * 30,
            path: '/auth/refresh',
        });

        return res.json({ accessToken, user: { userId, email, name } });
    }

    @Post('login')
    async login(@Body() dto: LoginDto, @Res() res: Response) {
        const { user, accessToken, refreshToken } = await this.auth.login(dto.email, dto.password);
        const { id, email, name } = user

        res.cookie(this.cookieName, refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: this.isProd,
            maxAge: 1000 * 60 * 60 * 24 * 30,
            path: '/auth/refresh',
        });

        return res.json({ accessToken, user: { id, email, name } });
    }

    @UseGuards(MainGuard)
    @Get('me')
    async me(@Req() req: Request) {
        const user = (req as any).user as { userId: string; email: string };
        return { user };
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
