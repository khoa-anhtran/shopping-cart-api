import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Types } from 'mongoose';
import { CartItemDto } from './dto/cart-item.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('/api/carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) { }

  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartsService.create(createCartDto);
  }

  @Get()
  async findAll() {
    const data = await this.cartsService.findAll();
    return data
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const userId = new Types.ObjectId(id)

    const data = await this.cartsService.findOne(userId);

    if (!data)
      return {}

    const res = Object.fromEntries(data.items.map(item => {
      const { addedAt, itemId, quantity } = item

      return [itemId, { quantity, addedAt }]
    }))

    return res
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    const userId = new Types.ObjectId(id)
    const { items } = updateCartDto

    const res = await this.cartsService.update(userId, items);

    return res
  }
}
