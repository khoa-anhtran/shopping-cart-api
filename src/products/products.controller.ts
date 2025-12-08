import { Controller, Get, Param, ParseIntPipe, Query, Req, Res } from "@nestjs/common";
import { ProductsService } from "./products.service";

@Controller('api/products')
export class ProductsController {
    constructor(private service: ProductsService) { }

    @Get('')
    async getProducts(@Query("after") after?: string, @Query("limit") limit?: number, @Query("categoryId") categoryId?: string) {
        const productsConnection = await this.service.findAll(after, limit, categoryId);

        return productsConnection;
    }

    @Get('/categories')
    async getCategories() {
        const categories = await this.service.getProductCategories()

        return categories;
    }

    @Get(':id')
    async getProduct(@Param('id', ParseIntPipe) id: number) {
        const product = await this.service.findByProductId(id);

        return { [id]: product };
    }

}