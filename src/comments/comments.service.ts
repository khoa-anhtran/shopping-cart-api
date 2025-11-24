import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { User } from 'src/users/user.schema';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment.name) private readonly model: Model<CommentDocument>) { }

  async create(createCommentDto: CreateCommentDto, userId: string, productId: string) {
    const createdComment = await this.model.create({ ...createCommentDto, user: userId, productId })

    const comment = await createdComment
      .populate({ path: 'user', select: 'name' })

    return {
      id: comment._id,
      text: comment.text,
      images: comment.images,
      depth: comment.depth,
      user: { name: (comment.user as User).name, id: comment.user._id, },
      parentId: comment.parentId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      replies: []
    };
  }

  async findAll(productId: string) {
    const docs = await this.model
      .find({ productId })
      .populate({ path: 'user', select: 'name' })
      .populate({
        path: 'replies',
        select: 'id'
      })
      .lean()

    const comments = docs.map(doc => (
      {
        id: doc._id,
        text: doc.text,
        images: doc.images,
        depth: doc.depth,
        user: { name: (doc.user as User).name, id: doc.user._id, },
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        parentId: doc.parentId,
        replies: doc.replies?.map(reply => reply._id),
      }
    ))

    return comments
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
