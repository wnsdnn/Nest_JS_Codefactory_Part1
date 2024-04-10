import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatsService } from './chats.service';
import { EnterChatDto } from './dto/enter-chat.dto';
import { CreateMessagesDto } from './messages/dto/create-messages.dto';
import { ChatsMessagesService } from './messages/messages.service';
import {
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SocketCatchHttpExceptionFilter } from '../common/exception-filter/socket-catch-http.exception-filter';
import { SocketBearerTokenGuard } from '../auth/guard/socket/socket-bearer-token.guard';
import { UsersModel } from '../users/entities/users.entity';

@WebSocketGateway({
  // ws://localhost:3000/chats
  namespace: 'chats',
})
export class ChatsGateway implements OnGatewayConnection {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly messageService: ChatsMessagesService,
  ) {}

  // await app.listen(3000); 이 값의 반환값을 server라고 생각하면 됨
  @WebSocketServer()
  server: Server;

  handleConnection(socket: Socket) {
    console.log(`on connect called :  ${socket.id}`);
  }

  // 소캣부분에서는 왜 그런지는 모르겠는데 컨트롤러단이 아니라면
  // GlobalPipe가 적용되지 않음 (그래서 그냥 코드에 바로 적용)
  //
  // 모든 Exception은 HttpException을 extends하고 있지만
  // WsException은 HttpException을 extends하고 있지 않기 때문에
  // 받아오는 과정에서 오류가 나도 WsException이 아니기 때문에 에러가 걸러지지 않음.
  // (서버에서 그냥 오류)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @UseFilters(SocketCatchHttpExceptionFilter)
  @UseGuards(SocketBearerTokenGuard)
  @SubscribeMessage('create_chat')
  async createChat(
    @MessageBody() dto: CreateChatDto,
    @ConnectedSocket() socket: Socket & { user: UsersModel },
  ) {
    const chat = await this.chatsService.createChat(dto);
  }

  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @UseFilters(SocketCatchHttpExceptionFilter)
  @UseGuards(SocketBearerTokenGuard)
  @SubscribeMessage('enter_chat')
  async enterChat(
    // 방의 chat ID들을 리스트로 받는다.
    @MessageBody() dto: EnterChatDto,
    @ConnectedSocket() socket: Socket,
  ) {
    for (const chatId of dto.chatIds) {
      const exists = await this.chatsService.checkIfChatExists(chatId);

      if (!exists) {
        throw new WsException({
          code: 100,
          message: `존재하지 않는 chat 입니다. chatId: ${chatId}`,
        });
      }
    }

    socket.join(dto.chatIds.map((x) => x.toString()));
  }

  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @UseFilters(SocketCatchHttpExceptionFilter)
  // 데이터를 보낼때마다 무언가를 검증해야할때는 Guard를 쓰는것이 맞지만,
  // Bearer Token을 통해 사용자의 정보를 검증하고 사용자가 맞는지 소캣과 연결하는 것은
  // 매번 Guard를 적용해주면 안된다.
  @UseGuards(SocketBearerTokenGuard)
  @SubscribeMessage('send_message')
  // socket.on('send_message', () => {  });
  async sendMessage(
    @MessageBody() dto: CreateMessagesDto,
    @ConnectedSocket() socket: Socket & { user: UsersModel },
  ) {
    const chatExists = await this.chatsService.checkIfChatExists(dto.chatId);

    if (!chatExists) {
      throw new WsException(
        `존재하지 않는 채팅방입니다. Chat ID : ${dto.chatId}`,
      );
    }

    const message = await this.messageService.createMessage(
      dto,
      socket.user.id,
    );

    // Broadcasting(브로드캐스팅) - 이방에서 현재 소켓(나)만 빼고 메시지를 보내는 기능
    // socket - 현재 소켓의 상태는 나를 제외한 상태
    socket
      .to(message.chat.id.toString())
      .emit('receive_message', message.message.toString());
    // this.server
    //   .in(chatId.toString())
    //   .emit('receive_message', message.toString());
  }
}
