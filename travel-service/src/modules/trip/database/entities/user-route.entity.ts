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

@Entity('user_routes')
export class UserRouteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'trip_id' })
  tripId: string;

  @Column({ name: 'city_id' })
  cityId: string;

  @Column({ name: 'route_data', type: 'jsonb' })
  routeData: any;

  @Column({ name: 'order_index' })
  orderIndex: number;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

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

  @ManyToOne(() => UserTripEntity, (trip) => trip.routes)
  @JoinColumn({ name: 'trip_id' })
  trip: UserTripEntity;

  @ManyToOne(() => CityEntity)
  @JoinColumn({ name: 'city_id' })
  city: CityEntity;

  constructor(props: Partial<UserRouteEntity>) {
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
