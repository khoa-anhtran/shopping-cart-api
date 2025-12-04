import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Res, Req } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Types } from 'mongoose';
import { MainGuard } from 'src/auth-strategy/main.guard';
import type { MyRequest } from 'src/type';

@Controller('/api/carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) { }

  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartsService.create(createCartDto);
  }

  @UseGuards(MainGuard)
  @Get('')
  async findOne(@Req() req: MyRequest) {
    const userId = req.user.userId

    const data = await this.cartsService.findOne(userId);

    if (!data)
      return {}

    return data
  }

  @UseGuards(MainGuard)
  @Put('')
  async update(@Req() req: MyRequest, @Body() updateCartDto: UpdateCartDto) {
    const userId = req.user.userId
    const { items } = updateCartDto

    const data = await this.cartsService.update(userId, items);

    return data
  }
}
