import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatsService } from './chats.service';

@WebSocketGateway({
  // ws://localhost:3000/chats
  namespace: 'chats',
})
export class ChatsGateway implements OnGatewayConnection {
  constructor(
    private readonly chatsService: ChatsService,
  ) {}

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
  enterChat(
    // 방의 chat ID들을 리스트로 받는다.
    @MessageBody() data: number[],
    @ConnectedSocket() socket: Socket,
  ) {
    for (const chatId of data) {
      // socket.join()
      socket.join(chatId.toString());
    }
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
