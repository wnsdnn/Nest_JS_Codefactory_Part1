import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';
import { DataSource } from 'typeorm';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    // 트랜잭션과 관련된 모든 쿼리를 담당할
    // 쿼리 러너를 생성한다.
    const qr = this.dataSource.createQueryRunner();

    // 쿼리 러너에 연결한다.
    await qr.connect();
    // 쿼리 러너에서 트랜젹션을 시작한다.
    // 이 시점부터 같은 뭐리 러너를 사용하면
    // 트랜젹션 안에서 데이터베이스 액션을 실행 할 수 있다.
    await qr.startTransaction();

    req.queryRunner = qr;

    return next.handle().pipe(
      // catchError 에러났을때 실행
      catchError(async (e) => {
        // 어떤 에러든 에러가 던져지면
        // 트랜젹션을 종료하고 원래 상태로 되돌린다.
        await qr.rollbackTransaction();
        await qr.release();

        throw new InternalServerErrorException(e.message);
      }),
      tap(async () => {
        // 쿼리 러너 커밋
        await qr.commitTransaction();
        await qr.release();
      }),
    );
  }
}
