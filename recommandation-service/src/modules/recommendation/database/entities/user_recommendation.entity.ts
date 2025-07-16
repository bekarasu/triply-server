import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RecommendationEntity } from './recommendation.entity';

@Entity('user_recommendations')
export class UserRecommendationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', length: 40 })
  userId: string;

  @Column({ name: 'trip_id', length: 40 })
  tripId: string;

  @Column({ name: 'recommend_id' })
  recommendId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => RecommendationEntity)
  @JoinColumn({ name: 'recommend_id' })
  recommendation: RecommendationEntity;

  @Column({
    name: 'deleted_at',
    nullable: true,
  })
  deletedAt: Date;

  constructor(props: Partial<RecommendationEntity>) {
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
