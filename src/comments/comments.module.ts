import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { AuthStrategyModule } from 'src/auth-strategy/auth-stategy.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]), AuthStrategyModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule { }
