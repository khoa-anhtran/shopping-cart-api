import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: "productCategories" })
export class ProductCategory {

    @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
    name!: string;

}

export type ProductCategoryDocument = HydratedDocument<ProductCategory>;
export const ProductCategorySchema = SchemaFactory.createForClass(ProductCategory);
