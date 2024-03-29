import { IsIn, IsNumber, IsOptional } from 'class-validator';

export class PaginatePostDto {
  // 이전 마지막 데이터의 ID
  // 이 프로퍼티에 입력된 ID 보다 높은 ID 부터 값을 가져오기
  @IsNumber()
  @IsOptional()
  where__id_less_more_than?: number;

  // 정렬
  // createAt -> 생성된 시간의 내림차/오름차 순으로 정렬
  //
  // 해당 리스트안에 있는 값들이 들어와야
  // Validation이 통과가 됨
  @IsIn(['ASC'])
  @IsOptional()
  order__createdAt: 'ASC' = 'ASC';

  // 몇개의 데이터를 응답으로 받을지
  @IsNumber()
  @IsOptional()
  take: number = 20;
}
