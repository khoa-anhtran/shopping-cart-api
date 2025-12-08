import { IsInt, IsISO8601, isLocale, IsMongoId, IsNotEmpty, IsString, Min } from "class-validator";
import { ProductDto } from "src/products/dto/product.dto";

export class CartItemDto extends ProductDto {
    @IsInt()
    @Min(1)
    quantity!: number;

    @IsNotEmpty()
    addedAt!: string;
}