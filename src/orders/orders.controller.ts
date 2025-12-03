import { Controller, Get, Param, ParseIntPipe, Post, Req, Res, UseGuards } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import type { MyRequest } from "src/type";
import { MainGuard } from "src/auth-strategy/main.guard";

@Controller('api/orders')
export class OrdersController {
    constructor(private service: OrdersService) { }

    @Get('')
    @UseGuards(MainGuard)
    async getOrders(@Req() req: MyRequest) {
        const userId = req.user.userId
        const orders = await this.service.findAll(userId);

        return { orders };
    }

    @Post('')
    @UseGuards(MainGuard)
    async placeOrder(@Req() req: MyRequest) {
        const userId = req.user.userId
        const orders = await this.service.findAll(userId);

        return { orders };
    }
}