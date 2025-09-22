import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityController } from './controllers/city.controller';
import { CityRepository } from './database/city.repository';
import { CityEntity } from './database/entities/city.entity';
import { CountryEntity } from './database/entities/country.entity';
import { CityService } from './services/city';

const controllers = [CityController];
const repositories = [CityRepository];
const services = [CityService];
const entities = [CityEntity, CountryEntity];

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers,
  providers: [...services, ...repositories],
})
export class CityModule {}
