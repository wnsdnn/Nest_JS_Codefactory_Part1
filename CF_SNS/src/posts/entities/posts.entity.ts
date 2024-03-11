import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PostModel {
  // 모든 Entiry 클래스에는 primaryColumn이 무조건 있어야한다.
  // PrimaryGeneratedColumn - 자동으로 id 배정
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  author: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;
}
