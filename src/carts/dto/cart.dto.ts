import { IsMongoId } from "class-validator";
import { CartItemDto } from "./cart-item.dto";

export class CartDto {
    @IsMongoId()
    userId: string;
    items: CartItemDto[];
}