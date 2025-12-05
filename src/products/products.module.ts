import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductCategory, ProductCategorySchema } from './schemas/product-category.schema';
import { Product, ProductSchema } from './schemas/product.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Product.name, schema: ProductSchema },
            { name: ProductCategory.name, schema: ProductCategorySchema }
        ])
    ],
    providers: [ProductsService],
    controllers: [ProductsController],
})
export class ProductModule { }
