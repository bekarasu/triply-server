import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserTripEntity } from './user-trip.entity';
import { CityEntity } from '../../../city/database/entities/city.entity';

@Entity('user_destinations')
export class UserDestinationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'trip_id', type: 'uuid' })
  tripId: string;

  @Column({ name: 'city_id' })
  cityId: number;

  @Column({ name: 'duration', type: 'smallint', default: 1 })
  duration: number;

  @Column({ name: 'budget', type: 'integer', default: 0 })
  budget: number;

  @Column({ name: 'order_index' })
  orderIndex: number;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: Date | null;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;

  @ManyToOne(() => UserTripEntity, (trip) => trip.destinations)
  @JoinColumn({ name: 'trip_id' })
  trip: UserTripEntity;

  @ManyToOne(() => CityEntity)
  @JoinColumn({ name: 'city_id' })
  city: CityEntity;

  constructor(props: Partial<UserDestinationEntity>) {
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
