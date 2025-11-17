import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AccountProvider, User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly model: Model<UserDocument>) { }

  findByEmail(email: string) {
    return this.model.findOne({ email }).exec();
  }

  findById(id: Types.ObjectId | string) {
    return this.model.findOne({ _id: id }).lean().exec();
  }

  create(data: { email: string; name: string; provider: AccountProvider }) {
    return this.model.create(data);
  }
}
