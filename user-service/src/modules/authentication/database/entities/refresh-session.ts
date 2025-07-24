import { OrmEntityBase } from '@src/libs/database';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('refresh_sessions')
export class RefreshSessionOrmEntity extends OrmEntityBase {
  @PrimaryColumn({
    name: 'id',
    length: 36,
  })
  id: string;

  @Column({
    name: 'refresh_session',
    length: 36,
    nullable: true,
    default: '',
  })
  refreshSession: string;

  constructor(props: any) {
    super(props);
  }
}
