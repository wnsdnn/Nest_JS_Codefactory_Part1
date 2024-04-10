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
import { TransactionInterceptor } from '../../common/interceptor/transaction.interceptor';
import { AccessTokenGuard } from '../../auth/guard/bearer-token.guard';
import { UsersModel } from '../../users/entity/users.entity';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {
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
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  getComments(
    @Param('postId', ParseIntPipe) postId: number,
    @Query() query: PaginateCommentDto,
  ) {
    return this.commentsService.paginateComments(query, postId);
  }

  @Get(':commentId')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  getCommnet(@Param('commentId', ParseIntPipe) commentId: number) {
    return this.commentsService.getCommentById(commentId);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async postComments(
    @User() user: UsersModel,
    @Param('postId', ParseIntPipe) postId,
    @Body() body: CreateCommentDto,
  ) {
    return this.commentsService.createComment(user, postId, body);
  }

  @Patch(':commentId')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  patchComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentsService.updateComment(commentId, dto);
  }

  @Delete(':commentId')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  deleteComment(@Param('commentId') commentId: number) {
    return this.commentsService.deleteComment(commentId);
  }
}
