import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CartItem } from '../schemas/cart-item.schema';
import { CartItemDto } from './cart-item.dto';

export class UpdateCartDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CartItemDto)
    items: CartItemDto[]
}
