import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

// 미들웨어 장점
// 1) 흐름상에서 가장 먼저 적용되는것이 미들웨어다
// 2) 패턴을 가지고 적용할수 있다. (path)
// 보안상에서 사용하는 다른 패키지들도 미들웨어로 구성되었음.
@Injectable()
export class LogMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): any {
    console.log(
      `[REQ] ${req.method} ${req.url} ${new Date().toLocaleString('kr')}`,
    );

    next();
  }
}
