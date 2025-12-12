import { Module } from '@nestjs/common';

import { AuthStrategyModule } from 'src/auth-strategy/auth-stategy.module';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [AuthStrategyModule, ConfigModule, UsersModule],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
