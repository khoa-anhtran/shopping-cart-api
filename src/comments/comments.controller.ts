import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('/api/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @Post(':product_id')
  create(@Param('product_id') productId: string, @Body() createCommentDto: CreateCommentDto) {
    const userId = "69158f84ead3d05ff2a113a3"
    return this.commentsService.create(createCommentDto, userId, productId);
  }

  @Get(':product_id')
  findAll(@Param('product_id') productId: string) {
    return this.commentsService.findAll(productId);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.commentsService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}
