import { Controller, Get, Param, ParseIntPipe, Req, Res } from "@nestjs/common";
import { ProductsService } from "./products.service";

@Controller('api/products')
export class ProductsController {
    constructor(private service: ProductsService) {

    }

    @Get('')
    async getProducts() {
        const products = await this.service.findAll();

        return { products };
    }

    @Get(':id')
    async getProduct(@Param('id', ParseIntPipe) id: number) {
        const product = await this.service.findByProductId(id);

        return { [id]: product };
    }
}