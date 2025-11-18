import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.schema';
import { ProductCategory, ProductCategorySchema } from './product-category.schema';

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
