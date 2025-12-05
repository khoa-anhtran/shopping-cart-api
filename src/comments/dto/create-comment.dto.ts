import { IsArray, IsMongoId, IsNumber, IsOptional, Max, Min } from "class-validator";

export class CreateCommentDto {

    @IsOptional()
    text?: string

    @IsOptional()
    @IsArray()
    media?: { publicId: string; url: string; mediaType: string }[]

    @IsMongoId()
    @IsOptional()
    parentId?: string

    @IsNumber()
    @Min(0)
    @Max(2)
    depth: number
}
