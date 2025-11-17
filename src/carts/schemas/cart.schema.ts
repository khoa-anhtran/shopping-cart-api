import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CartItem, CartItemSchema } from './cart-item.schema';

@Schema({ timestamps: false })
export class Cart {
    @Prop({ required: true, ref: "Users" })
    userId!: Types.ObjectId

    @Prop({ required: true, default: [], type: [CartItemSchema] })
    items!: CartItem[];
}

export type CartDocument = HydratedDocument<Cart>;
export const CartSchema = SchemaFactory.createForClass(Cart);
