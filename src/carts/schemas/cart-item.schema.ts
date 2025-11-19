import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MSchema } from 'mongoose';
import { Types } from "mongoose";
import { Product } from "src/products/schemas/product.schema";

@Schema({ _id: false })
export class CartItem {
    @Prop({ required: true, ref: Product.name, index: true, type: MSchema.Types.ObjectId })
    itemId!: Types.ObjectId;

    @Prop({ required: true })
    quantity!: number;

    @Prop({ required: true, default: new Date().toISOString() })
    addedAt!: string;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);
