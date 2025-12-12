import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import type { MyRequest } from 'src/type';
import { MainGuard } from 'src/auth-strategy/main.guard';
import { OrderDto } from './dto/order.dto';
import { UsersService } from 'src/users/users.service';
import type { Response } from 'express';

@Controller('api/orders')
export class OrdersController {
  constructor(
    private service: OrdersService,
    private usersService: UsersService,
  ) {}

  @Get('')
  @UseGuards(MainGuard)
  async getOrders(@Req() req: MyRequest) {
    const userId = req.user.userId;
    const orders = await this.service.findAll(userId);

    return { orders };
  }

  @Post('')
  @UseGuards(MainGuard)
  async placeOrder(
    @Req() req: MyRequest,
    @Body() data: OrderDto,
    @Res() res: Response,
  ) {
    const userId = req.user.userId;
    const order = await this.service.create(userId, data);

    if (data.isSaved) {
      const response = await this.usersService.saveShippingAddress(
        userId,
        data.shippingAddress,
      );

      if (!response.isSuccess) return res.json(response);
    }

    return res.json({ order });
  }
}
