import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Order, OrderDocument } from "./schemas/order.schema";

@Injectable()
export class OrdersService {
    constructor(@InjectModel(Order.name) private readonly model: Model<OrderDocument>) { }

    async findAll(userId: string) {

    }
}
