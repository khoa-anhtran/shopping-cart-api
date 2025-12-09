import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { UpdateCartItemDto } from './update-cart-item.dto';

export class UpdateCartDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateCartItemDto)
  items: UpdateCartItemDto[];
}
