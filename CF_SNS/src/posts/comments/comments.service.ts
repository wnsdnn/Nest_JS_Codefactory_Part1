import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentsModel } from './entity/comments.entity';
import { Repository } from 'typeorm';
import { PaginateCommentDto } from './dto/paginate-comment-dto';
import { CommonService } from '../../common/common.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UsersModel } from '../../users/entity/users.entity';
import { DEFAULT_COMMENT_FIND_OPTIONS } from './const/default-comment-find-options.const';
import { UpdateCommentsDto } from './dto/update-comments.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsModel)
    private readonly commentRepository: Repository<CommentsModel>,
    private readonly commmonService: CommonService,
  ) {}

  async paginateComments(dto: PaginateCommentDto, postId: number) {
    return this.commmonService.paginate(
      dto,
      this.commentRepository,
      {
        ...DEFAULT_COMMENT_FIND_OPTIONS,
        where: {
          post: {
            id: postId,
          },
        },
      },
      `posts/${postId}/comments`,
    );
  }

  async createComment(
    author: UsersModel,
    postId: number,
    commentDto: CreateCommentDto,
  ) {
    const comment = this.commentRepository.save({
      author,
      post: {
        id: postId,
      },
      ...commentDto,
    });

    return comment;
  }

  async getCommentById(id: number) {
    const comment = await this.commentRepository.findOne({
      ...DEFAULT_COMMENT_FIND_OPTIONS,
      where: {
        id,
      },
    });

    if (!comment) {
      throw new BadRequestException(`id: ${id} Comment는 존재하지 않습니다.`);
    }

    return comment;
  }

  async updateComment(commentId: number, dto: UpdateCommentsDto) {
    const comment = await this.commentRepository.findOne({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      throw new BadRequestException('존재하지 않는 댓글입니다.');
    }

    const prevComment = await this.commentRepository.preload({
      id: commentId,
      ...dto,
    });

    const newComment = await this.commentRepository.save(prevComment);

    return newComment;
  }

  async deleteComment(id: number) {
    const comment = await this.commentRepository.findOne({
      where: {
        id,
      },
    });

    if (!comment) {
      throw new BadRequestException('존재하지 않는 댓글입니다.');
    }

    await this.commentRepository.delete(id);

    return id;
  }
}
