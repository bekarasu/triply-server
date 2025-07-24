import { OrmEntityBase } from '@src/libs/database';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('provider_accounts')
export class ProviderAccountOrmEntity extends OrmEntityBase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'email',
    length: 100,
    nullable: true,
  })
  email: string;

  @Column({
    name: 'provider',
    length: 10,
  })
  provider: string;

  @Column({
    name: 'provider_id',
    length: 100,
    nullable: true,
  })
  providerId: string;

  @Column({
    name: 'metadata',
    type: 'json',
    nullable: true,
  })
  metadata: any;

  @Column({
    name: 'user_id',
    length: 36,
  })
  userId: string;

  constructor(props: any) {
    super(props);
  }
}
