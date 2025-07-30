import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CityEntity } from './entities/city.entity';

@Injectable()
export class CityRepository {
  constructor(
    @InjectRepository(CityEntity)
    private readonly repository: Repository<CityEntity>,
  ) {}

  async findAllByCountryId(countryId: number): Promise<CityEntity[]> {
    return await this.repository.find({
      where: { deletedAt: null, countryId },
    });
  }
}
