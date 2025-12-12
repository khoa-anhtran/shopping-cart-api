import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class ShippingAddress {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  addressLine: string;

  @Prop({ required: false })
  subAddressLine?: string;

  @Prop({ required: true })
  province: string;

  @Prop({ required: true })
  commune: string;
}

export const ShippingAddressSchema =
  SchemaFactory.createForClass(ShippingAddress);
