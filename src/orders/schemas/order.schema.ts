import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Schema as MSchema } from 'mongoose';
import { ShippingAddress, ShippingAddressSchema } from './shipping-address.schema';
import { CartItem, CartItemSchema } from 'src/carts/schemas/cart-item.schema';

@Schema({ timestamps: true })
export class Order {

    @Prop({ required: true, ref: "Users", type: MSchema.Types.ObjectId })
    userId!: Types.ObjectId

    @Prop({ required: true, type: ShippingAddressSchema })
    shippingAddress!: ShippingAddress;

    @Prop({
        required: true,
        type: {
            method: { type: String, required: true },
            isPaid: { type: Boolean, required: true, default: false },
        },
    })
    paymentInfo!: {
        type: string,
        isPaid: boolean
    };

    @Prop({ required: true, default: [], type: [CartItemSchema] })
    items!: CartItem[];

    @Prop({ required: true })
    total!: number
}

export type OrderDocument = HydratedDocument<Order>;
export const OrderSchema = SchemaFactory.createForClass(Order);
