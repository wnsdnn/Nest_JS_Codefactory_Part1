import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  // 엔드포인트에서 함수에 로직이 실행되기전에 먼저실행됨.
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    /**
     * 요청이 들어올때 REQ 요청이 들어온 타임스탬프를 찍는다.
     * [REQ] {요청 path} {요청 시간}
     *
     * 요청이 끝날때 (응답이 나갈때) 다시 타임스탬프를 찍는다.
     * [RES] {요청 path} {응답 시간} {얼마나 걸렸는지 ms}
     */
    const now = new Date();
    const req = context.switchToHttp().getRequest();

    // /posts
    // /common/image
    const path = req.originalUrl;

    // [REQ] {요청 path} {요청 시간}
    console.log(`[REQ] ${path} ${now.toLocaleString('kr')}`);

    // handle()을 실행하면 return값을 받을수 있음
    // return next.handle()을 실행하는 순간
    // 라우트의 로직이 전부 실행되고 응답이 반환된다.
    // observable로
    //
    // pipe -로직이 실행되고 나서 응답값을 변경하는 작업을 수행함
    // pipe안에 써놓은 각각의 함수를 실행함
    return next.handle().pipe(
      // tap(): rxjs 함수 -> 값을 전달받아서 모니터링을 할수 있다
      tap((observable) => {
        // [RES] {요청 path} {응답 시간} {얼마나 걸렸는지 ms}
        console.log(
          `[RES] ${path} ${new Date().toLocaleString('kr')} ${new Date().getMilliseconds() - now.getMilliseconds()}ms`,
        );
      }),
      // // map(): rxjs 함수 -> 값을 변형시킴
      // map((observable) => {
      //   return {
      //     message: '응답이 변경되었습니다.',
      //     response: observable,
      //   };
      // }),
    );
  }
}
