import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity()
export class UserModel {
  // ID
  // @PrimaryGeneratedColumn() - 자동으로 ID를 생성한다.
  //
  // @PrimaryColumn() - 모든 테이블에서 기본적으로 존재해야한다.
  // 테이블 안에서 각각의 Row를 구분할 수 있는 컬럼이다.
  //
  // @PrimaryGeneratedColumn('uuid')
  // PrimaryGeneratedColumn -> 순서대로 id가 1씩 위로 올라간다.
  // (1, 2, 3, 4, 5, ...)
  //
  // UUID
  // abcd1234-abcd1234-abcd1234-abcd1234
  @PrimaryGeneratedColumn()
  id: number;

  // 제목
  @Column()
  title: string;

  // 데이터 생성일자
  // 데이터가 생성되는 날짜와 시간이 자동으로 찍힌다.
  @CreateDateColumn()
  createdAt: Date;

  // 데이터 업데이트 일자
  // 데이터가 업데이트되는 날짜와 시간이 자동으로 찍힌다.
  @UpdateDateColumn()
  updatedAt: Date;

  // 버전
  // 데이터가 업데이트 될때마다 1씩 올라간다.
  // 처음 생성된 값은 1이다.
  // (save() 함수가 몇번 불렸는지 기억한다.)
  @VersionColumn()
  version: number;

  // @Generated 에노테이션은 @Column 에노테이션과 같이 써야한다.
  // @Generated('increment') -> id 자동 바인딩 : number
  // @Generated('uuid') -> uuid 자동 바인딩 : string
  @Column()
  @Generated('uuid')
  additionalId: string;
}
