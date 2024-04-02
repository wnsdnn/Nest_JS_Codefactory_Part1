import { Column, Entity, ManyToOne } from 'typeorm';
import { UsersModel } from '../../users/entities/users.entity';
import { BaseModel } from '../../common/entity/base.entity';
import { IsString } from 'class-validator';
import { stringValidationMessage } from '../../common/validation-message/string-validation.message';
import { Transform } from 'class-transformer';
import * as path from 'path';
import { POST_PUBLIC_IMAGE_PATH } from '../../common/const/path.const';

@Entity()
export class PostsModel extends BaseModel {
  // 모든 Entiry 클래스에는 primaryColumn이 무조건 있어야한다.
  // PrimaryGeneratedColumn - 자동으로 id 배정
  // @PrimaryGeneratedColumn()
  // id: number;

  // 1) UsersModel과 연동한다. ForeingKey를 이욯해서
  // 2) null이 될 수 없다.
  @ManyToOne(() => UsersModel, (user) => user.posts, {
    nullable: false,
  })
  author: UsersModel;

  @Column()
  @IsString({
    message: stringValidationMessage,
  })
  title: string;

  @Column()
  @IsString({
    message: stringValidationMessage,
  })
  content: string;

  @Column({
    nullable: true,
  })
  // 자동으로 값 변경
  @Transform(
    ({ value }) => value && `/${path.join(POST_PUBLIC_IMAGE_PATH, value)}`,
  )
  image?: string;

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;
}
