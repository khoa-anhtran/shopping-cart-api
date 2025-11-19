import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ProductDto } from "./dto/product.dto";
import { ProductCategory } from "./product-category.schema";
import { Product, ProductDocument } from "./schemas/product.schema";

@Injectable()
export class ProductsService {
    constructor(@InjectModel(Product.name) private readonly model: Model<ProductDocument>) { }

    async findByProductId(id: number) {
        return this.model.findOne({ id }).lean();
    }

    async findAll() {
        const docs = await this.model
            .find()
            .populate({ path: 'categoryId', select: 'name' })
            .exec()

        const data = docs.map(this.toProductDto)

        return data
    }

    toProductDto(doc: ProductDocument): ProductDto {
        const { _id, title, thumbnail, categoryId, price } = doc

        const category = (categoryId as ProductCategory).name

        return {
            id: _id.toString(),
            title,
            thumbnail,
            price,
            category
        }
    }

}
