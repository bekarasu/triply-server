import { OrmEntityBase } from '@src/libs/database';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserOrmEntity extends OrmEntityBase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'name',
    length: 20,
    nullable: true,
  })
  name: string;

  @Column({
    name: 'surname',
    length: 20,
    nullable: true,
  })
  surname: string;

  @Column({
    name: 'email',
    length: 100,
    nullable: true,
    unique: true,
  })
  email: string;

  @Column({
    name: 'phone_number',
    length: 15,
    nullable: true,
    unique: true,
  })
  phoneNumber: string;

  @Column({
    name: 'status',
    length: 10,
    default: 'INIT',
  })
  status: string;

  constructor(props: any) {
    super(props);
  }
}
