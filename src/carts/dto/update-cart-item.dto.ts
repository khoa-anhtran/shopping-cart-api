import { IsInt, IsMongoId, IsNotEmpty, Min } from 'class-validator';

export class UpdateCartItemDto {
  @IsMongoId()
  itemId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsNotEmpty()
  addedAt!: string;
}
