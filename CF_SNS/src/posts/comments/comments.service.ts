import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentsModel } from './entity/comments.entity';
import { Repository } from 'typeorm';
import { PaginateCommentDto } from './dto/paginate-comment-dto';
import { CommonService } from '../../common/common.service';
import { CreateCommentDto } from './dto/create-comment.dto';

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

  async createComment(
    authorId: number,
    postId: number,
    commentDto: CreateCommentDto,
  ) {
    const comment = this.commentRepository.create({
      author: {
        id: authorId,
      },
      post: {
        id: postId,
      },
      comment: commentDto.comment,
      likeCount: 0,
    });

    const newComment = await this.commentRepository.save(comment);

    return newComment;
  }

  async getCommentById(id: number) {
    const comment = await this.commentRepository.findOne({
      where: {
        id,
      },
    });

    if (!comment) {
      throw new NotFoundException('댓글이 존재하지 않습니다.');
    }

    return comment;
  }

  async updateComment(id: number, dto: CreateCommentDto) {
    const comment = await this.getCommentById(id);

    if (dto.comment) {
      comment.comment = dto.comment;
    }

    const newComment = await this.commentRepository.save(comment);

    return newComment;
  }

  async deleteComment(id: number) {
    const comment = await this.getCommentById(id);

    await this.commentRepository.delete(comment);

    return id;
  }
}
