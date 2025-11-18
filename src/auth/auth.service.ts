import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { AccountsService } from 'src/accounts/accounts.service';
import { AccountProvider } from 'src/users/user.schema';
import { CartsService } from 'src/carts/carts.service';
import { nanoid } from 'nanoid';
import { InjectModel } from '@nestjs/mongoose';
import { RefreshToken, RefreshTokenDocument } from './refresh-token.schema';
import { Model } from 'mongoose';
import { JwtPayload, JwtRTPayload } from 'src/types/auth';

@Injectable()
export class AuthService {
    constructor(private accounts: AccountsService,
        private users: UsersService,
        private carts: CartsService,
        private jwt: JwtService,
        @InjectModel(RefreshToken.name) private readonly model: Model<RefreshTokenDocument>) { }

    async register(data: { email: string; name: string; password: string }) {
        const { email, name, password } = data

        const exists = await this.accounts.findByEmail(email);

        if (exists) throw new ConflictException('Email already registered');

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const user = await this.users.create({ email, name, provider: AccountProvider.MANUAL });
        await this.accounts.create({ _id: user._id, email: data.email, passwordHash });
        await this.carts.create({ userId: user._id })

        const sub = user.id

        const accessToken = await this.signAccessToken(sub, email)
        const { jti, refreshToken } = await this.signRefreshToken(sub, email)

        await this.createRefreshToken({ jti, userId: sub })

        return { user, accessToken, refreshToken };
    }

    async login(email: string, password: string) {
        const account = await this.accounts.findByEmail(email);
        if (!account) throw new UnauthorizedException('Invalid credentials');

        const ok = await bcrypt.compare(password, account.passwordHash);
        if (!ok) throw new UnauthorizedException('Invalid credentials');

        const { id: sub } = account

        const user = await this.users.findById(account._id)

        if (!user) throw new UnauthorizedException('User is not existed');

        const accessToken = await this.signAccessToken(sub, email)
        const { jti, refreshToken } = await this.signRefreshToken(sub, email)

        await this.createRefreshToken({ jti, userId: sub })

        return { user, accessToken, refreshToken };
    }

    async refresh(refreshToken: string | undefined) {
        if (!refreshToken)
            throw new UnauthorizedException('Missing refresh token');

        let decoded: JwtRTPayload;

        try {
            decoded = await this.jwt.verifyAsync<JwtRTPayload>(refreshToken)
        } catch {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }

        const { email, sub: userId, jti } = decoded

        const { revoked } = await this.findRefreshTokenByJti(jti)

        if (revoked) {
            throw new UnauthorizedException('Expired refresh token');
        }

        const accessToken = await this.signAccessToken(userId, email)
        const user = await this.getUserInfo(userId)

        return { user, accessToken };
    }

    async signRefreshToken(sub: string, email: string) {
        const jti = nanoid()
        const refreshToken = await this.jwt.signAsync<JwtRTPayload>({ sub, email, jti }, { expiresIn: '30d' });

        return { refreshToken, jti };
    }

    async signAccessToken(sub: string, email: string) {
        const token = await this.jwt.signAsync({ sub, email });

        return token;
    }

    async createRefreshToken({ jti, userId }: { jti: string, userId: string }) {
        await this.model.create({ jti, userId })
    }

    async findRefreshTokenByJti(jti: string) {
        const refreshToken = await this.model.findOne({ jti })

        if (!refreshToken)
            throw new Error("Refresh token is not existed")

        const { revoked } = refreshToken

        return { revoked };
    }

    async revokeRefreshToken(jti: string) {
        // e.g. await this.refreshTokensRepo.update({ jti }, { revoked: true });
    }

    async getUserInfo(userId: string) {
        const user = await this.users.findById(userId)

        if (!user)
            throw new Error("No User existed")

        const { email, name } = user

        return { id: userId, email, name }
    }
}
