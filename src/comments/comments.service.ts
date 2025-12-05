import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { User } from 'src/users/user.schema';
import { Edge } from 'src/type';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment.name) private readonly model: Model<CommentDocument>) { }

  async create(createCommentDto: CreateCommentDto, userId: string, productId: string) {
    const createdComment = await this.model.create({ ...createCommentDto, user: userId, productId })

    const comment = await createdComment
      .populate({ path: 'user', select: 'name avatar' })

    return {
      id: comment._id,
      text: comment.text,
      media: comment.media,
      depth: comment.depth,
      user: comment.user,
      parentId: comment.parentId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      replies: []
    };
  }

  async findAll(productId: string, after?: string, limit = 5) {

    const filter: any = { productId };

    // if we have a cursor, only get items after that cursor
    if (after) {
      filter._id = { $lt: new Types.ObjectId(after) }; // ascending by _id
    }

    const docs = await this.model
      .find(filter)
      .sort({ _id: -1 })         // oldest → newest
      .limit(limit + 1)         // fetch one extra to detect next page
      .populate({ path: 'user', select: 'name avatar' })
      .populate({ path: 'replies', select: '_id' })
      .lean();

    const hasNextPage = docs.length > limit;
    const slice = hasNextPage ? docs.slice(0, limit) : docs;

    const edges: Edge<Comment>[] = slice.map(doc => {
      const node: Comment = {
        id: doc._id.toString(),
        text: doc.text,
        media: doc.media,
        depth: doc.depth,
        user: doc.user,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        parentId: doc.parentId,
        replies: doc.replies?.map((r: any) => r._id.toString()) ?? [],
        productId: doc.productId
      };

      return {
        node,
        cursor: doc._id.toString(),
      };
    });

    const startCursor = edges.length ? edges[0].cursor : null;
    const endCursor = edges.length ? edges[edges.length - 1].cursor : null;

    return {
      edges,
      pageInfo: {
        startCursor,
        endCursor,
        hasNextPage,
      },
    };
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
