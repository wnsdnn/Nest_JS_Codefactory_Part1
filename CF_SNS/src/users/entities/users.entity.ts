import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RolesEnum } from './const/foles.const';

/**
 * id: number;
 *
 * nickname: string;
 *
 * email: string
 *
 * password: string
 *
 * role: [RoleEnum.USER, RoleEnum.ADMIN]
 */
@Entity()
export class UsersModel {
  @PrimaryGeneratedColumn()
  id: number;

  // 1) 길이가 20을 넘지 않을 것
  // 2) 유일무이한 값이 될 것
  @Column({
    // length: 20,
    unique: true,
  })
  nickname: string;

  // 1) 유일무이한 값이 될 것
  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  role: RolesEnum;
}
