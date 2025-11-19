import { IsMongoId } from "class-validator";

export class ProductDto {
    @IsMongoId()
    id: string
    title!: string;
    category!: string;
    price!: number;
    thumbnail!: string;
}