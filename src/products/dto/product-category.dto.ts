import { IsMongoId } from "class-validator";

export class ProductCategoryDto {
    @IsMongoId()
    id: string
    name: string
    subCategories: {
        id: string
        name: string
    }[]
}