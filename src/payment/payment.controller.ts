import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import type { MyRequest } from 'src/type';
import { MainGuard } from 'src/auth-strategy/main.guard';
import { UsersService } from 'src/users/users.service';

@Controller('api/payment')
export class PaymentController {
  constructor(
    private service: PaymentService,
    private usersService: UsersService,
  ) {}

  @Get('/shipping-address')
  @UseGuards(MainGuard)
  async getShippingAddress(@Req() req: MyRequest) {
    const userId = req.user.userId;

    const shippingAddress = await this.usersService.getShippingAddress(userId);

    return { shippingAddress };
  }
}
