import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CriteriaController } from './controllers/criteria.controller';
import { CriteriaEntity } from './database/entities/criteria.entity';
import { CriteriaRepository } from './database/criteria.repository';
import { CriteriaService } from './services/criteria.service';

const controllers = [CriteriaController];
const repositories = [CriteriaRepository];
const services = [CriteriaService];
const entities = [CriteriaEntity];

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers,
  providers: [...services, ...repositories],
})
export class CriteriasModule {}
