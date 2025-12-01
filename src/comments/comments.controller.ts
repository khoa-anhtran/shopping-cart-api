import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { MainGuard } from 'src/auth-strategy/main.guard';
import type { MyRequest } from 'src/type';

@Controller('/api/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @UseGuards(MainGuard)
  @Post(':product_id')
  create(@Req() req: MyRequest, @Param('product_id') productId: string, @Body() createCommentDto: CreateCommentDto) {
    const userId = req.user.userId ?? ""
    return this.commentsService.create(createCommentDto, userId, productId);
  }

  @UseGuards(MainGuard)
  @Get(':product_id')
  findAll(@Param('product_id') productId: string) {
    return this.commentsService.findAll(productId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}
