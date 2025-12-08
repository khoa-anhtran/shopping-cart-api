import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ProductDto } from "./dto/product.dto";
import { ProductCategory, ProductCategoryDocument } from "./schemas/product-category.schema";
import { Product, ProductDocument } from "./schemas/product.schema";
import { Edge } from "src/type";
import { ProductCategoryDto } from "./dto/product-category.dto";

@Injectable()
export class ProductsService {
    constructor(@InjectModel(Product.name) private readonly model: Model<ProductDocument>,
        @InjectModel(ProductCategory.name) private readonly categoryModel: Model<ProductCategoryDocument>) { }

    async findByProductId(id: number) {
        return this.model.findOne({ id }).lean();
    }

    async findAll(after?: string, limit = 12, categoryId?: string) {

        const filter: any = {};

        // if we have a cursor, only get items after that cursor
        if (after) {
            filter._id = { $gt: new Types.ObjectId(after) }; // ascending by _id
        }

        if (categoryId) {
            filter.categoryId = categoryId
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

    async getProductCategories() {
        const categories = await this.categoryModel
            .find({ subCategories: { $exists: true, $ne: [] } })
            .populate({ path: 'subCategories', select: 'name' })

        return categories.map(this.toCategoryDto)
    }

    toProductDto(doc: ProductDocument): ProductDto {
        const { _id, title, thumbnail, categoryId, price } = doc

        const category = (categoryId as ProductCategory)._id.toString()

        return {
            id: _id.toString(),
            title,
            thumbnail,
            price,
            category
        }
    }

    toCategoryDto(doc: ProductCategoryDocument): ProductCategoryDto {
        const { _id, name, subCategories } = doc

        const categories = (subCategories as ProductCategory[])

        return {
            id: _id.toString(),
            name,
            subCategories: categories.map((category) => ({
                id: category._id.toString(),
                name: category.name
            }))
        }
    }

}
