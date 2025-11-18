import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Product, ProductDocument } from "./product.schema";

@Injectable()
export class ProductsService {
    constructor(@InjectModel(Product.name) private readonly model: Model<ProductDocument>) { }

    findByProductId(id: number) {
        return this.model.findOne({ id }).lean();
    }

    findAll() {
        return this.model.find()
            .populate({ path: 'categoryId', select: 'name' })
            .lean();
    }

}
