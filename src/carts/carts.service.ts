import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { Model, Types } from 'mongoose';
import { CartDto } from './dto/cart.dto';
import { Product } from 'src/products/schemas/product.schema';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartsService {
  constructor(
    @InjectModel(Cart.name) private readonly model: Model<CartDocument>,
  ) {}

  create(createCartDto: CreateCartDto) {
    const { userId } = createCartDto;
    return this.model.create({ userId });
  }

  findAll() {
    return this.model.find().lean();
  }

  async findOne(userId: string) {
    const typedUserId = new Types.ObjectId(userId);

    const doc = await this.model
      .findOne({ userId: typedUserId })
      .populate({
        path: 'items',
        populate: {
          path: 'itemId',
        },
      })
      .exec();
    return doc ? this.toCartDto(doc) : undefined;
  }

  async update(userId: string, items: UpdateCartItemDto[]) {
    try {
      const typedUserId = new Types.ObjectId(userId);
      await this.model
        .findOneAndUpdate(
          { userId: typedUserId },
          { items },
          {
            overwrite: true,
            runValidators: true,
          },
        )
        .exec();

      return {
        isSuccess: true,
      };
    } catch (err) {
      return {
        isSuccess: false,
        message: new Error(err).message,
      };
    }
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }

  toCartDto(doc: CartDocument): CartDto {
    return {
      userId: doc.userId.toString(),
      items: doc.items.map((item) => {
        const product = item.itemId as Product;

        return {
          quantity: item.quantity,
          addedAt: item.addedAt,
          category: (product.categoryId as Types.ObjectId).toString(),
          id: product._id.toString(),
          price: product.price,
          title: product.title,
          thumbnail: product.thumbnail,
        };
      }),
    };
  }
}
