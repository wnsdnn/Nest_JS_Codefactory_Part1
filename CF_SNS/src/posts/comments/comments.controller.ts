import { Controller, Get, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { PaginateCommentDto } from './dto/paginate-comment-dto';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

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
   * 3) GET(':commentID') 특정 comment만 하나 가져오는 기능
   * 4) POST() 코멘트 생성하는 기능
   * 5) PATCH(':commentID') 특정 comment 업데이트 하는 기능
   * 6) DELETE(':commentID') 특정 comment 삭제하는 기능
   */

  @Get('')
  getComments(@Query() query: PaginateCommentDto) {
    return this.commentsService.paginateComments(query);
  }
}
