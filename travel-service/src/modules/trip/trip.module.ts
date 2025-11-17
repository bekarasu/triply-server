import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTripController } from './controllers/user-trip.controller';
import { UserTripEntity } from './database/entities/user-trip.entity';
import { UserTripRepository } from './database/user-trip.repository';
import { UserTripService } from './services/user-trip.service';
import { UserRouteEntity } from './database/entities/user-route.entity';

const controllers = [UserTripController];
const repositories = [UserTripRepository];
const services = [UserTripService];
const entities = [UserRouteEntity, UserTripEntity];

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers,
  providers: [...services, ...repositories],
})
export class TripModule {}
