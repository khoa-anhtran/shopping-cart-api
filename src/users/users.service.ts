import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AccountProvider, User, UserDocument } from './user.schema';
import { UpdateUserDto } from 'src/comments/dto/update-user.dto';
import { ShippingAddress } from 'src/orders/schemas/shipping-address.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly model: Model<UserDocument>) { }

  findByEmail(email: string, provider: AccountProvider = AccountProvider.MANUAL) {
    return this.model.findOne({ email, provider }).exec();
  }

  findById(id: Types.ObjectId | string) {
    return this.model.findOne({ _id: id }).lean().exec();
  }

  create(data: { email: string; name: string; provider: AccountProvider; providerId?: string, avatar?: string }) {
    return this.model.create(data);
  }

  async update(userId: string, data: UpdateUserDto) {
    try {
      const { name, avatar } = data

      await this.model.findOneAndUpdate({ _id: userId }, { name, avatar }, {
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

  async getShippingAddress(userId: string) {
    const user = await this.model.findById(userId)

    if (!user)
      throw new Error("This user is not existed")

    return user.shippingAddress
  }

  async saveShippingAddress(userId: string, shippingAddress: ShippingAddress) {
    try {
      await this.model.findOneAndUpdate({ _id: userId }, { shippingAddress }, {
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
}
