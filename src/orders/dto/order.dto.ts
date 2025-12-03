import { IsArray, IsBoolean, IsInt, IsMongoId, IsNotEmpty } from "class-validator";
import { ShippingAddress } from "../schemas/shipping-address.schema";
import { CartItemDto } from "src/carts/dto/cart-item.dto";

export class OrderDto {
    @IsNotEmpty()
    shippingAddress!: ShippingAddress;

    @IsNotEmpty()
    paymentInfo!: {
        method: string,
        isPaid: boolean
    };

    @IsNotEmpty()
    @IsArray()
    items!: CartItemDto[];

    @IsNotEmpty()
    @IsInt()
    total!: number

    @IsNotEmpty()
    @IsBoolean()
    isSaved!: boolean
}