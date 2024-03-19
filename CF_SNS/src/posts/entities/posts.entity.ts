import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersModel } from '../../users/entities/users.entity';

@Entity()
export class PostsModel {
  // 모든 Entiry 클래스에는 primaryColumn이 무조건 있어야한다.
  // PrimaryGeneratedColumn - 자동으로 id 배정
  @PrimaryGeneratedColumn()
  id: number;

  // 1) UsersModel과 연동한다. ForeingKey를 이욯해서
  // 2) null이 될 수 없다.
  @ManyToOne(() => UsersModel, (user) => user.posts, {
    nullable: false,
  })
  author: UsersModel;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;
}
