import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RecommendationType } from '../../enums/recommendation-type.enum';

@Entity('recommendations')
export class RecommendationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'place_name' })
  place_name: string;

  @Column({ name: 'city_id' })
  city_id: string;

  @Column({
    name: 'recommendation_type',
    type: 'enum',
    enum: RecommendationType,
  })
  recommendationType: RecommendationType;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  score: number;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

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
