import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_trips')
export class UserTripEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', length: 36 })
  userId: string;

  @Column({ length: 80 })
  name: string;

  @Column({ name: 'trip_start_date', type: 'date' })
  tripStartDate: Date;

  @Column({ name: 'trip_end_date', type: 'date' })
  tripEndDate: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;

  @OneToMany('UserRouteEntity', 'trip')
  routes: any[];

  constructor(props: Partial<UserTripEntity>) {
    if (props) {
      Object.assign(this, {
        ...props,
      });
      this.createdAt = props.createdAt || new Date();
      this.updatedAt = props.updatedAt || new Date();
      this.deletedAt = props.deletedAt || null;
    }
  }
}
