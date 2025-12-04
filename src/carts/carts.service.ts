import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { Model, Types } from 'mongoose';
import { CartItem } from './schemas/cart-item.schema';
import { CartItemDto } from './dto/cart-item.dto';
import { CartDto } from './dto/cart.dto';

@Injectable()
export class CartsService {
  constructor(@InjectModel(Cart.name) private readonly model: Model<CartDocument>) { }

  create(createCartDto: CreateCartDto) {
    const { userId } = createCartDto
    return this.model.create({ userId })
  }

  findAll() {
    return this.model.find().lean()
  }

  async findOne(userId: string) {
    const typedUserId = new Types.ObjectId(userId)

    const doc = await this.model.findOne({ userId: typedUserId }).exec()

    return doc ? this.toCartDto(doc) : undefined
  }

  async update(userId: string, items: CartItemDto[]) {
    try {
      const typedUserId = new Types.ObjectId(userId)
      await this.model.findOneAndUpdate({ userId: typedUserId }, { items }, {
        overwrite: true,
        runValidators: true,
      }).exec()

      return {
        isSuccess: true
      }
    }
    catch (err) {
      return {
        isSuccess: false,
        message: new Error(err).message
      }
    }
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }

  toCartDto(doc: CartDocument): CartDto {
    return {
      userId: doc.userId.toString(),
      items: doc.items.map(item => ({
        itemId: item.itemId.toString(),
        quantity: item.quantity,
        addedAt: item.addedAt
      }))
    }
  }
}
