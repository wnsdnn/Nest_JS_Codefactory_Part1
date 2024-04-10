import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
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
import { UsersModel } from '../users/entity/users.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway({
  // ws://localhost:3000/chats
  namespace: 'chats',
})
export class ChatsGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  constructor(
    private readonly chatsService: ChatsService,
    private readonly messageService: ChatsMessagesService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  // await app.listen(3000); 이 값의 반환값을 server라고 생각하면 됨
  @WebSocketServer()
  server: Server;

  // socket에 정보를 입력해주면 그 socket정보가 다른 socket에서도 전부 지속이됨
  // socket은 한번 뚫어놓으면 다시 연결을 끊을때까지 계속 파이프처럼 정보를 통신함.
  //
  // #Guard를 사용해서 Token값을 계속 검증했을때의 문제점
  // 데이터를 보낼때마다 무언가를 검증해야할때는 Guard를 쓰는것이 맞지만,
  // Bearer Token을 통해 사용자의 정보를 검증하고 사용자가 맞는지 소캣과 연결하는 것은
  // 매번 Guard를 적용해주면 안된다. (이제 가드안씀)
  // @UseGuards(SocketBearerTokenGuard)
  //
  // 결론 - socket에서 token을 가져오는 작업은 맨처음에 소캣이 연결되었을때만 가져와서 socket에서 넣어주면
  // 해당 socket을 사용하는 모든곳에서 넣어준 값을 사용할수 있다. (사용자 정보를 매번 검증할 필요가 없어짐)
  async handleConnection(socket: Socket & { user: UsersModel }) {
    console.log(`on connect called :  ${socket.id}`);

    // Socket-bearer-token.guard.ts 파일의 코드 가져옴
    const header = socket.handshake.headers;

    // Bearer xxxxxxx
    const rawToken = header['authorization'];

    if (!rawToken) {
      // 연결 강제로 끊기
      socket.disconnect();
    }

    try {
      const token = this.authService.extractTokenFromHeader(rawToken, true);

      const payload = this.authService.verifyToken(token);
      const user = await this.usersService.getUserByEmail(payload.email);

      socket.user = user;
    } catch (e) {
      socket.disconnect();
    }
  }

  // gateway가 시작됬을때 함수를 실행하거나 로직을 실행하고 싶을때 사용
  // server값은 @WebSocketServer()의 server값이랑 완전히 똑같음
  afterInit(server: any): any {
    console.log(`after gateway init`);
  }

  // 연결이 끊켰을때 실행
  handleDisconnect(socket: Socket) {
    console.log(`on disconnet called : ${socket.id}`);
  }

  // 소캣부분에서는 왜 그런지는 모르겠는데 컨트롤러단이 아니라면
  // GlobalPipe가 적용되지 않음 (그래서 그냥 코드에 바로 적용)
  //
  // 모든 Exception은 HttpException을 extends하고 있지만
  // WsException은 HttpException을 extends하고 있지 않기 때문에
  // 받아오는 과정에서 오류가 나도 WsException이 아니기 때문에 에러가 걸러지지 않음.
  // (서버에서 그냥 오류)
  // ** 해당오류에 관해서는 SocketCatchHttpExceptionFileter를 만들어서 HttpException오류를
  // 전부 WsException오류로 바꿔주는 방식으로 수정해서 해결함. **
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
  @SubscribeMessage('enter_chat')
  async enterChat(
    // 방의 chat ID들을 리스트로 받는다.
    @MessageBody() dto: EnterChatDto,
    @ConnectedSocket() socket: Socket & { user: UsersModel },
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
