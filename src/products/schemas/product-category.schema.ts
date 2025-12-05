import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Schema as MSchema } from 'mongoose';


@Schema({ collection: "productCategories" })
export class ProductCategory {
    _id!: Types.ObjectId

    @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
    name!: string;

    @Prop({ required: false, type: [MSchema.Types.ObjectId], ref: ProductCategory.name })
    subCategories?: Types.ObjectId[] | ProductCategory[];

}

export type ProductCategoryDocument = HydratedDocument<ProductCategory>;
export const ProductCategorySchema = SchemaFactory.createForClass(ProductCategory);
