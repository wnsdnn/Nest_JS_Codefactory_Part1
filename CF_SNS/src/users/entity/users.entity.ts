import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { RolesEnum } from './const/foles.const';
import { PostsModel } from '../../posts/entity/posts.entity';
import { BaseModel } from '../../common/entity/base.entity';
import { IsEmail, IsString, Length } from 'class-validator';
import { lengthValidationMessage } from '../../common/validation-message/length-validation.message';
import { stringValidationMessage } from '../../common/validation-message/string-validation.message';
import { emailValidationMessage } from '../../common/validation-message/email-validation.message';
import { Exclude } from 'class-transformer';
import { ChatsModel } from '../../chats/entity/chats.entity';
import { MessagesModel } from '../../chats/messages/entity/message.entity';
import { CommentsModel } from '../../posts/comments/entity/comments.entity';
import { UserFollowersModel } from './user-followers.entity';

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
// entity를 @Exclude() 설정을 해두고 보여줄 파라미터만 @Expose() 해줄수도 있음
// @Exclude()
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
  // @Expose()
  nickname: string;

  // @Exclude()의 반대 개념
  // 실재 존재하지 않는 값을 조회에 포함시킬수 있음
  // @Expose()
  // get nicknameAndEmail() {
  //   return this.nickname + '/' + this.email;
  // }

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
  // @Expose()
  email: string;

  @Column()
  @IsString({
    message: stringValidationMessage,
  })
  @Length(3, 8, {
    message: lengthValidationMessage,
  })
  /**
   * Request
   * frontend -> backend
   * plain object (JSON) -> class instance (dto)
   *
   * Response
   * backend -> frontend
   * class instance (dto) -> plain object (JSON)
   *
   * toClassOnly -> class instance로 변환될때만 (요청보낼때만 변환)
   * toPlainOnly -> plain object로 변환될때만 (응답보낼때만 변환)
   */
  @Exclude({
    toPlainOnly: true,
  })
  password: string;

  @Column({
    type: 'enum',
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  role: RolesEnum;

  @OneToMany(() => PostsModel, (post) => post.author)
  posts: PostsModel[];

  @ManyToMany(() => ChatsModel, (chat) => chat.users)
  @JoinTable()
  chats: ChatsModel[];

  @OneToMany(() => MessagesModel, (message) => message.author)
  messages: MessagesModel;

  @OneToMany(() => CommentsModel, (comment) => comment.author)
  postComments: CommentsModel[];

  // 내가 팔로우 하고 있는 사람들
  @OneToMany(() => UserFollowersModel, (ufm) => ufm.follower)
  followers: UserFollowersModel[];

  // 나를 팔로우 하고 있는 사람들
  @OneToMany(() => UserFollowersModel, (ufm) => ufm.followee)
  followees: UserFollowersModel[];

  @Column({
    default: 0,
  })
  followerCount: number;

  @Column({
    default: 0,
  })
  followeeCount: number;
}
