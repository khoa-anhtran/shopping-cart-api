import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Account, AccountDocument } from './account.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class AccountsService {
    constructor(@InjectModel(Account.name) private readonly model: Model<AccountDocument>) { }

    findByEmail(email: string) {
        return this.model.findOne({ email }).exec();
    }

    findByUserId(userId: string) {
        return this.model.findOne({ userId }).lean().exec();
    }

    create(data: { id: string, email: string; passwordHash: string }) {
        return this.model.create(data);
    }
}
