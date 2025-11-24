import { IsMongoId, IsNumber, IsOptional, Max, Min, ValidateNested } from "class-validator";

export class CreateCommentDto {

    @IsOptional()
    text?: string

    @IsMongoId()
    @IsOptional()
    parentId?: string

    @IsNumber()
    @Min(0)
    @Max(2)
    depth: number
}
