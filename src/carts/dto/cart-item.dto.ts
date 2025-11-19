import { IsInt, IsISO8601, isLocale, IsMongoId, IsNotEmpty, Min } from "class-validator";

export class CartItemDto {
    @IsMongoId()
    itemId!: string;

    @IsInt()
    @Min(1)
    quantity!: number;

    @IsNotEmpty()
    
    addedAt!: string;
}