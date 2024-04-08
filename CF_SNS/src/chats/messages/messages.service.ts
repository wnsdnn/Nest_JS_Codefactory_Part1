import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { MessagesModel } from './entity/message.entity';
import { CommonService } from '../../common/common.service';
import { BasePaginationDto } from '../../common/dto/base-pagination.dto';
import { CreateMessagesDto } from './dto/create-messages.dto';

@Injectable()
export class ChatsMessagesService {
  constructor(
    @InjectRepository(MessagesModel)
    private readonly messagesRepository: Repository<MessagesModel>,
    private readonly commonService: CommonService,
  ) {}

  async createMessage(dto: CreateMessagesDto) {
    let chatId = dto.chatId ?? 0;
    let authorId = dto.authorId ?? 0;
    let message = dto.message ?? '';

    if (typeof dto === 'string') {
      chatId = JSON.parse(dto).chatId;
      authorId = JSON.parse(dto).authorId;
      message = JSON.parse(dto).message;
    }

    const messageObj = await this.messagesRepository.save({
      chat: {
        id: chatId,
      },
      author: {
        id: authorId,
      },
      message: message,
    });

    return this.messagesRepository.findOne({
      where: {
        id: messageObj.id,
      },
      relations: {
        chat: true,
      },
    });
  }

  paginateMessages(
    dto: BasePaginationDto,
    overrideFindOptions: FindManyOptions<MessagesModel>,
  ) {
    return this.commonService.paginate(
      dto,
      this.messagesRepository,
      overrideFindOptions,
      'messages',
    );
  }
}
