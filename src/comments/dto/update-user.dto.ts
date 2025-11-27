import { IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
    @IsString()
    name!: string;

    @IsOptional()
    @IsString()
    avatar?: string;
}