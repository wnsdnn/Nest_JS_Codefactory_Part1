import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatsModel } from './entity/chats.entity';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(ChatsModel)
    private readonly chatsRepository: Repository<ChatsModel>,
  ) {}

  // chat을 만든다
  async createChat(dto: CreateChatDto) {
    // const { userIds } = JSON.parse(dto);
    let userIds = [];

    if (typeof dto === 'string') {
      userIds = JSON.parse(dto).userIds;
    }

    const chat = await this.chatsRepository.save({
      // 1, 2, 3
      // [{id: 1}, {id: 2}, {id:3}]
      users: userIds.map((id) => ({ id })),
    });

    return this.chatsRepository.findOne({
      where: {
        id: chat.id,
      },
    });
  }
}
