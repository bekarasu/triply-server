import { BaseEntity, Column } from 'typeorm';

export abstract class OrmEntityBase extends BaseEntity {
  @Column({
    name: 'created_at',
    update: false,
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
  })
  updatedAt: Date;

  constructor(props?: any) {
    super();
    if (props) {
      Object.assign(this, props);
      this.createdAt = props.createdAt || new Date();
      this.updatedAt = new Date();
    }
  }
}
