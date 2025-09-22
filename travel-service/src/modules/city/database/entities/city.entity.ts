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
import { CountryEntity } from './country.entity';

@Entity('cities')
export class CityEntity {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 10 })
  capital: string;

  @Column({ length: 100 })
  admin_name: string;

  @Column({ length: 100 })
  city_ascii: string;

  @Column({ name: 'country_id' })
  countryId: number;

  @Column({ name: 'population' })
  population: number;

  @Column({ name: 'latitude', type: 'decimal', precision: 9, scale: 6 })
  latitude: number;

  @Column({ name: 'longitude', type: 'decimal', precision: 9, scale: 6 })
  longitude: number;

  @ManyToOne(() => CountryEntity, (country) => country.cities)
  @JoinColumn({ name: 'country_id' })
  country: CountryEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;

  constructor(props: Partial<CityEntity>) {
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
