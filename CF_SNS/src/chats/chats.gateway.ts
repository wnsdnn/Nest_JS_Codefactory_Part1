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

@WebSocketGateway({
  // ws://localhost:3000/chats
  namespace: 'chats',
})
export class ChatsGateway implements OnGatewayConnection {
  constructor(private readonly chatsService: ChatsService) {}

  // await app.listen(3000); 이 값의 반환값을 server라고 생각하면 됨
  @WebSocketServer()
  server: Server;

  handleConnection(socket: Socket) {
    console.log(`on connect called :  ${socket.id}`);
  }

  @SubscribeMessage('create_chat')
  async createChat(
    @MessageBody() dto: CreateChatDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const chat = await this.chatsService.createChat(dto);
  }

  @SubscribeMessage('enter_chat')
  async enterChat(
    // 방의 chat ID들을 리스트로 받는다.
    @MessageBody() data: EnterChatDto,
    @ConnectedSocket() socket: Socket,
  ) {
    let chatIds = data.chatIds ?? [];

    if (typeof data === 'string') {
      chatIds = JSON.parse(data).chatIds;
    }

    for (const chatId of chatIds) {
      const exists = await this.chatsService.checkIfChatExists(chatId);

      if (!exists) {
        throw new WsException({
          code: 100,
          message: `존재하지 않는 chat 입니다. chatId: ${chatId}`,
        });
      }
    }

    socket.join(chatIds.map((x) => x.toString()));
  }

  // socket.on('send_message', () => {  });
  @SubscribeMessage('send_message')
  sendMessage(
    @MessageBody()
    messageBody: {
      message: string;
      chatId: number;
    },
    @ConnectedSocket() socket: Socket,
  ) {
    const { message, chatId } = JSON.parse(messageBody.toString());

    // Broadcasting(브로드캐스팅) - 이방에서 현재 소켓(나)만 빼고 메시지를 보내는 기능
    // socket - 현재 소켓의 상태는 나를 제외한 상태
    socket.to(chatId.toString()).emit('receive_message', message.toString());
    // this.server
    //   .in(chatId.toString())
    //   .emit('receive_message', message.toString());
  }
}
