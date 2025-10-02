import { OrmEntityBase } from '@src/libs/database';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserVO } from './user.value-object';

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
    length: 50,
    nullable: true,
  })
  phone: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ['ACTIVE', 'INACTIVE', 'WAITING_VERIFICATION'],
    default: 'WAITING_VERIFICATION',
  })
  status: string;

  constructor(props?: Partial<UserOrmEntity>) {
    super();
    if (props) {
      Object.assign(this, props);
    }
  }

  toVO(): UserVO {
    return new UserVO({
      id: this.id,
      name: this.name,
      surname: this.surname,
      email: this.email,
      phone: this.phone,
      status: this.status,
    });
  }
}
