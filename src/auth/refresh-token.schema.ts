import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: false })
export class RefreshToken {
    @Prop({ required: true })
    jti!: string

    @Prop({ required: true })
    userId!: string

    @Prop({ required: true, default: false })
    revoked!: boolean

}

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;
export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
