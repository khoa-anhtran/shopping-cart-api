import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductModule } from './products/products.module';
import { AccountsModule } from './accounts/accounts.module';
import { CartsModule } from './carts/carts.module';
import { CommentsModule } from './comments/comments.module';
import { UploadModule } from './cloudinary/upload.module';
import { AddressModule } from './address/address.module';
import { OrderModule } from './orders/orders.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({ uri: cfg.get<string>('MONGO_URI')! }),
    }),
    UsersModule,
    AuthModule,
    ProductModule,
    AccountsModule,
    CartsModule,
    CommentsModule,
    UploadModule,
    AddressModule,
    OrderModule,
    PaymentModule
  ],
})

export class AppModule { }
