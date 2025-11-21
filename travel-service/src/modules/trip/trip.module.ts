import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTripController } from './controllers/user-trip.controller';
import { UserTripEntity } from './database/entities/user-trip.entity';
import { UserTripRepository } from './database/user-trip.repository';
import { UserTripService } from './services/user-trip.service';
import { UserDestinationEntity } from './database/entities/user-destination.entity';
import { CityModule } from '../city/city.module';

const controllers = [UserTripController];
const repositories = [UserTripRepository];
const services = [UserTripService];
const entities = [UserDestinationEntity, UserTripEntity];

@Module({
  imports: [TypeOrmModule.forFeature(entities), CityModule],
  controllers,
  providers: [...services, ...repositories],
})
export class TripModule {}
