import { Column, Entity, OneToMany } from 'typeorm';
import { RolesEnum } from './const/foles.const';
import { PostModel } from '../../posts/posts.service';
import { PostsModel } from '../../posts/entities/posts.entity';
import { BaseModel } from '../../common/entity/base.entity';
import { IsEmail, IsString, Length } from 'class-validator';
import { lengthValidationMessage } from '../../common/validation-message/length-validation.message';
import { stringValidationMessage } from '../../common/validation-message/string-validation.message';
import { emailValidationMessage } from '../../common/validation-message/email-validation.message';

/**
 * id: number;
 *
 * nickname: string;
 *
 * email: string;
 *
 * password: string;
 *
 * role: [RoleEnum.USER, RoleEnum.ADMIN];
 *
 * updatedAt: Date;
 *
 * createdAt: Date;
 */
@Entity()
export class UsersModel extends BaseModel {
  // @PrimaryGeneratedColumn()
  // id: number;

  // 1) 길이가 20을 넘지 않을 것
  // 2) 유일무이한 값이 될 것
  @Column({
    // length: 20,
    unique: true,
  })
  @IsString({
    message: stringValidationMessage,
  })
  @Length(1, 20, {
    message: lengthValidationMessage,
  })
  nickname: string;

  // 1) 유일무이한 값이 될 것
  @Column({
    unique: true,
  })
  @IsString({
    message: stringValidationMessage,
  })
  @IsEmail(
    {},
    {
      message: emailValidationMessage,
    },
  )
  email: string;

  @Column()
  @IsString({
    message: stringValidationMessage,
  })
  @Length(3, 8, {
    message: lengthValidationMessage,
  })
  password: string;

  @Column({
    type: 'enum',
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  role: RolesEnum;

  @OneToMany(() => PostsModel, (post) => post.author)
  posts: PostModel[];
}
