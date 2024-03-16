import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// @Entity()로 지정 X
export class Name {
  @Column()
  first: string;

  @Column()
  last: string;
}

@Entity()
export class StudentModel {
  @PrimaryGeneratedColumn()
  id: number;

  // 클래스 그대로 반환
  // Name class에 first, last + name(현재 컬럼의 이름) 값으로 컬럼이 생김
  @Column(() => Name)
  name: Name;

  @Column()
  class: string;
}

@Entity()
export class TeacherModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(() => Name)
  name: Name;

  @Column()
  salary: number;
}
