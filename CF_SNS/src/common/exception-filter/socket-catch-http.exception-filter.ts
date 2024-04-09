import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';

// HttpException 에러를 WsException 에러로 바꿔주는 에러
@Catch(HttpException)
export class SocketCatchHttpExceptionFilter extends BaseWsExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    // 소캣 가져오는 방법
    const socket = host.switchToWs().getClient();

    socket.emit('exception', {
      // 오류 객체를 data에 넣기
      data: exception.getResponse(),
    });
  }
}
