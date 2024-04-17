import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { PaginateCommentDto } from './dto/paginate-comment-dto';
import { User } from '../../users/decorator/user.decorator';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UsersModel } from '../../users/entity/users.entity';
import { UpdateCommentsDto } from './dto/update-comments.dto';
import { IsPublic } from '../../common/decorator/is-public.decorator';
import { IsCommentMineOrAdminGuard } from './guard/is-comment-mine-or-admin.guard';
import { TransactionInterceptor } from '../../common/interceptor/transaction.interceptor';
import { QueryRunnerDecorator } from '../../common/decorator/query-runnder.decorator';
import { QueryRunner as QR } from 'typeorm';
import { PostsService } from '../posts.service';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly postsService: PostsService,
  ) {
    /**
     * 1) Entity 생성
     * author -> 작성자
     * post -> 귀속되는 post
     * comment -> 실제 댓글 내용
     * likeCount -> 좋아요 갯수
     *
     * id -> PrimaryGeneratedColumn
     * createdAt -> 생성일자
     * updatedAt -> 업데이트일자
     *
     * 2) GET() pagination
     * 3) GET(':commentId') 특정 comment만 하나 가져오는 기능
     * 4) POST() 코멘트 생성하는 기능
     * 5) PATCH(':commentId') 특정 comment 업데이트 하는 기능
     * 6) DELETE(':commentId') 특정 comment 삭제하는 기능
     */
  }

  @Get()
  @IsPublic()
  getComments(
    @Param('postId', ParseIntPipe) postId: number,
    @Query() query: PaginateCommentDto,
  ) {
    return this.commentsService.paginateComments(query, postId);
  }

  @Get(':commentId')
  @IsPublic()
  getCommnet(@Param('commentId', ParseIntPipe) commentId: number) {
    return this.commentsService.getCommentById(commentId);
  }

  @Post()
  @UseInterceptors(TransactionInterceptor)
  async postComments(
    @User() user: UsersModel,
    @Param('postId', ParseIntPipe) postId,
    @Body() body: CreateCommentDto,
    @QueryRunnerDecorator() qr: QR,
  ) {
    const resp = await this.commentsService.createComment(
      user,
      postId,
      body,
      qr,
    );

    await this.postsService.incrementCommentCount(postId, qr);

    return resp;
  }

  @Patch(':commentId')
  @UseGuards(IsCommentMineOrAdminGuard)
  async patchComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() dto: UpdateCommentsDto,
  ) {
    return this.commentsService.updateComment(commentId, dto);
  }

  @Delete(':commentId')
  @UseInterceptors(TransactionInterceptor)
  @UseGuards(IsCommentMineOrAdminGuard)
  async deleteComment(
    @Param('commentId') commentId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @QueryRunnerDecorator() qr: QR,
  ) {
    const resp = await this.commentsService.deleteComment(commentId, qr);

    await this.postsService.decrementCommentCount(postId, qr);

    return resp;
  }
}
