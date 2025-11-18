import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Schema as MSchema } from 'mongoose';
import { ProductCategory } from './product-category.schema';

@Schema({ timestamps: true })
export class Product {

    @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
    title!: string;

    @Prop({ required: true, ref: ProductCategory.name, index: true, type: MSchema.Types.ObjectId })
    categoryId!: Types.ObjectId | ProductCategory;

    @Prop({ required: true })
    price!: number;

    @Prop({ required: true })
    thumbnail!: string;

}

export type ProductDocument = HydratedDocument<Product>;
export const ProductSchema = SchemaFactory.createForClass(Product);
