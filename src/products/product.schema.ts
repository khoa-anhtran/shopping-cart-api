import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { nanoid } from 'nanoid';

@Schema({ timestamps: true })
export class Product {

    @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
    title!: string;

    @Prop({ required: true })
    price!: number;

    @Prop({ required: true })
    thumbnail!: string;
}

export type ProductDocument = HydratedDocument<Product>;
export const ProductSchema = SchemaFactory.createForClass(Product);
