import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Account {

    @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
    email!: string;

    @Prop({ required: true })
    passwordHash!: string;
}

export type AccountDocument = HydratedDocument<Account>;
export const AccountSchema = SchemaFactory.createForClass(Account);
