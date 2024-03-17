import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserModel } from './user.entity';

@Entity()
export class ProfileModel {
  @PrimaryGeneratedColumn()
  id: number;

  // UserModel과 1대1 연동
  @OneToOne(() => UserModel, (user) => user.profile)
  // @JoinColumn()
  user: UserModel;

  @Column()
  profileImg: string;
}
