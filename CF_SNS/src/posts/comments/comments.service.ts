import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentsModel } from './entity/comments.entity';
import { Repository } from 'typeorm';
import { PaginateCommentDto } from './dto/paginate-comment-dto';
import { CommonService } from '../../common/common.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsModel)
    private readonly commentRepository: Repository<CommentsModel>,
    private readonly commmonService: CommonService,
  ) {}

  async paginateComments(dto: PaginateCommentDto) {
    return this.commmonService.paginate(
      dto,
      this.commentRepository,
      {},
      'comments',
    );
  }
}
