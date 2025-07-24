import { OrmEntityBase } from '@src/libs/database';
import { v4 as uuidV4 } from 'uuid';

import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('refresh_sessions')
export class UserRefreshSessionOrmEntity extends OrmEntityBase {
  @PrimaryColumn()
  id: string;

  @Column({
    name: 'refresh_session',
  })
  refreshSession: string;

  constructor(props: any) {
    super(props);

    if (props) {
      this.id = uuidV4();
      this.createdAt = new Date();
      this.updatedAt = new Date();
    }
  }
}
