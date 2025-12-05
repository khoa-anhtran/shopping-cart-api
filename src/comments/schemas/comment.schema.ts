import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Schema as MSchema } from 'mongoose';
import { Product } from "src/products/schemas/product.schema";
import { User } from "src/users/user.schema";

@Schema({ timestamps: true })
export class Comment {
    _id?: string;
    id: string;

    @Prop({ required: true, ref: User.name, type: MSchema.Types.ObjectId })
    user!: Types.ObjectId | User;

    @Prop({ required: true, ref: Product.name, type: MSchema.Types.ObjectId })
    productId!: Types.ObjectId;

    @Prop()
    text: string;

    @Prop({ type: [{ publicId: String, url: String, mediaType: String }], default: [] })
    media: { publicId: string; url: string; mediaType: string }[];

    @Prop({ type: MSchema.Types.ObjectId, ref: Comment.name, default: null })
    parentId: Types.ObjectId | null | Comment; // null for top-level

    @Prop({ required: true, min: 0, max: 2 })
    depth: number; // 0 = top-level, 1 = reply, 2 = reply of reply

    // just for TypeScript, no @Prop needed for virtuals
    replies?: Comment[];         // or Comment[] or string[] depending on how you use it

    // for timestamps (just declare them, no @Prop)
    createdAt?: Date;
    updatedAt?: Date;
}

export type CommentDocument = HydratedDocument<Comment>;
export const CommentSchema = SchemaFactory.createForClass(Comment);

// VIRTUAL FIELD: replies[]
CommentSchema.virtual('replies', {
    ref: Comment.name,        // model to use
    localField: '_id',        // field on this doc
    foreignField: 'parentId', // field on children
});

// make virtuals appear in JSON/objects
CommentSchema.set('toObject', { virtuals: true });
CommentSchema.set('toJSON', { virtuals: true });
