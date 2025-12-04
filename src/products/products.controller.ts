import { Controller, Get, Param, ParseIntPipe, Query, Req, Res } from "@nestjs/common";
import { ProductsService } from "./products.service";

@Controller('api/products')
export class ProductsController {
    constructor(private service: ProductsService) { }

    @Get('')
    async getProducts(@Query("after") after?: string, @Query("limit") limit?: number) {
        const productsConnection = await this.service.findAll(after, limit);

        return productsConnection;
    }

    @Get(':id')
    async getProduct(@Param('id', ParseIntPipe) id: number) {
        const product = await this.service.findByProductId(id);

        return { [id]: product };
    }
}