import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, Res, UseGuards } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import type { MyRequest } from "src/type";
import { MainGuard } from "src/auth-strategy/main.guard";

@Controller('api/payment')
export class PaymentController {
    constructor(private service: PaymentService) { }

    @Get('')
    @UseGuards(MainGuard)
    async getOrders(@Req() req: MyRequest) {
        const userId = req.user.userId
        const orders = await this.service.findAll(userId);

        return { orders };
    }
}