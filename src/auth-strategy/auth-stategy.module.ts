import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from '../auth-strategy/jwt.strategy';
import { AccountsModule } from 'src/accounts/accounts.module';
import { CartsModule } from 'src/carts/carts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AzureAdStrategy } from '../auth-strategy/azure-ad.strategy';
import { JwtAuthGuard } from '../auth-strategy/jwt-auth.guard';
import { AzureAdGuard } from '../auth-strategy/azure-ad.guard';
import { MainGuard } from '../auth-strategy/main.guard';

@Module({
    imports: [
        ConfigModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (cfg: ConfigService) => ({
                secret: cfg.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '15m' },
            }),
        }),
        UsersModule
    ],
    providers: [JwtStrategy, AzureAdStrategy, JwtAuthGuard, AzureAdGuard, MainGuard],
    exports: [JwtAuthGuard, AzureAdGuard, MainGuard],
})
export class AuthStrategyModule { }
