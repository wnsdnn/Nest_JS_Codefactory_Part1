import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { ProfileModel } from './profile.entity';
import { PostModel } from './post.entity';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

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
  // @Column({
  //   // 데이터베이스에서 인지하는 컬럼 타입
  //   // 자동으로 유추됨
  //   type: 'varchar',
  //   // 데이터베이스 컬럼 이름
  //   // 프로퍼티 이름으로 자동 유추됨
  //   name: 'title',
  //   // 값의 길이
  //   // 입력 할 수 있는 글자의 길이가 300
  //   length: 300,
  //   // null이 가능한지
  //   nullable: true,
  //   // true면 처음 저장할때만 값 지정 가능
  //   // 이후에는 값 변경 불가능,
  //   update: true,
  //   // find()를 실행할때 기본으로 값을 불러올지
  //   // 기본값이 true,
  //   select: false,
  //   // 기본 값
  //   // 아무것도 입력 안했을때 기본으로 입력되게 되는 값
  //   default: 'default value',
  //   // 컴럼주에서 유일무이한 값이 돼어야하는지
  //   unique: false,
  // })
  // title: string;

  @Column()
  email: string;

  // // 특정 값들로 컬럼의 값을 제한하고 싶을때 사용
  // @Column({
  //   type: 'enum',
  //   enum: Role,
  //   default: Role.USER,
  // })
  // role: Role;

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

  // ProfileModel과 1대1 연동
  @OneToOne(() => ProfileModel, (profile) => profile.user, {
    // find() 실행 할때마다 항상 같이 가져올 relation
    eager: false,
    // 저장할때 relation을 한번에 같이 저장가능
    cascade: true,
    // null이 가능한지
    nullable: true,
    // 관계가 삭제했을때
    // no action -> 아무것도 안함
    // cascade -> 참조하는 Row도 같이 삭제
    // set null -> 참조하는 Row에서 참조 id를 null로 변경
    // default -> 기본 세팅으로 설정 (테이블의 기본 세팅)
    // restrict -> 참조하고 있는 Row가 있는경우 참조당하는 Row 삭제 불가
    onDelete: 'RESTRICT',
  })
  @JoinColumn()
  profile: ProfileModel;

  @OneToMany(() => PostModel, (post) => post.author)
  posts: PostModel[];

  @Column({
    default: 0,
  })
  count: number;
}
