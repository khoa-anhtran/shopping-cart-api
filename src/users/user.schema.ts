import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  _id: string

  @Prop({ required: true, lowercase: true, trim: true, index: true })
  email!: string;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ trim: true })
  avatar?: string

  @Prop({ required: true })
  provider!: AccountProvider;

  @Prop({ trim: true })
  providerId?: string;
}

export enum AccountProvider {
  MANUAL = 'MANUAL',
  MICROSOFT = 'MICROSOFT',
  GOOGLE = 'GOOGLE',
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
