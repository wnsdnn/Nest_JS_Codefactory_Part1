import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  // ws://localhost:3000/chats
  namespace: 'chats',
})
export class ChatsGateway implements OnGatewayConnection {
  // await app.listen(3000); 이 값의 반환값을 server라고 생각하면 됨
  @WebSocketServer()
  server: Server;

  handleConnection(socket: Socket) {
    console.log(`on connect called :  ${socket.id}`);
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

    this.server
      .in(chatId.toString())
      .emit('receive_message', message.toString());
  }
}
