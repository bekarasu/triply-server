import { OrmEntityBase } from '@src/libs/database';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserVO } from '../../domain/value-objects/user';

@Entity('local_accounts')
export class LocalAccountOrmEntity extends OrmEntityBase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'user_id',
    type: 'uuid',
  })
  userId: string;

  @Column({
    name: 'email',
    length: 100,
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
    name: 'password_hash',
    length: 255,
  })
  passwordHash: string;

  @Column({
    name: 'salt',
    length: 255,
  })
  salt: string;

  @Column({
    name: 'email_verified',
    default: false,
  })
  emailVerified: boolean;

  constructor(props: any) {
    super(props);
  }
}
