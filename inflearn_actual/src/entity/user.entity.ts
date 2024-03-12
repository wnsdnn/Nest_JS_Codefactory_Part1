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
  //
  // @PrimaryGeneratedColumn() - 자동으로 ID를 생성한다. [id 자동생성]
  //
  // @PrimaryColumn() - Primary Column은 모든 테이블에서 기본적으로 존재해야한다.
  // [id를 직접 생성하겠다]
  // 테이블 안에서 각각의 Row를 구분 할 수 있는 컬럼이다.
  //
  // @PrimaryGeneratedColumn('uuid')
  //
  // ParimaryGeneratedColumn -> 순서대로 위로 올라간다. (1, 2, 3, 4...)
  // UUID
  // sdf23f2-fwef323fwefwe-23r2323wef-342r3ewfwfew
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

  // 데이터가 업데이트 될때마다 1씩 올라간다.
  // 처음 생성되면 값은 1이다.
  // save() 함수가 몇번 불렸는지 기억한다.
  @VersionColumn()
  version: number;

  // number | string으로 지정가능
  // @Gernerated()는 @Column()과 같이 써야함
  //
  // @Generated('increment') -> [number 타입] 자동으로 id생성 (1, 2, 3, 4, 5 ...)
  // @Generated('uuid') -> [string 타입] uuid 생성
  @Column()
  @Generated('increment')
  additionalId: number;
}
