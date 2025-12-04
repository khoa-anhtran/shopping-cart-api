import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ProductDto } from "./dto/product.dto";
import { ProductCategory } from "./product-category.schema";
import { Product, ProductDocument } from "./schemas/product.schema";
import { Edge } from "src/type";

@Injectable()
export class ProductsService {
    constructor(@InjectModel(Product.name) private readonly model: Model<ProductDocument>) { }

    async findByProductId(id: number) {
        return this.model.findOne({ id }).lean();
    }

    async findAll(after?: string, limit = 8) {

        const filter: any = {};

        // if we have a cursor, only get items after that cursor
        if (after) {
            filter._id = { $gt: new Types.ObjectId(after) }; // ascending by _id
        }

        const docs = await this.model
            .find(filter)
            .sort({ _id: 1 })         // oldest → newest
            .limit(limit + 1)         // fetch one extra to detect next page
            .populate({ path: 'categoryId', select: 'name' })
            .exec();

        const hasNextPage = docs.length > limit;
        const slice = hasNextPage ? docs.slice(0, limit) : docs;

        const edges: Edge<ProductDto>[] = slice.map(doc => {
            const node: ProductDto = this.toProductDto(doc)

            return {
                node,
                cursor: doc._id.toString(),
            };
        });

        const startCursor = edges.length ? edges[0].cursor : null;
        const endCursor = edges.length ? edges[edges.length - 1].cursor : null;

        return {
            edges,
            pageInfo: {
                startCursor,
                endCursor,
                hasNextPage,
            },
        };
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
