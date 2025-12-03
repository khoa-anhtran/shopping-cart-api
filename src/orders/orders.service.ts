import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Order, OrderDocument } from "./schemas/order.schema";
import { OrderDto } from "./dto/order.dto";

@Injectable()
export class OrdersService {
    constructor(@InjectModel(Order.name) private readonly model: Model<OrderDocument>) { }

    async findAll(userId: string) {

    }

    async create(userId: string, data: OrderDto) {
        const doc = await this.model.create({ userId, ...data })

        return doc
    }
}
