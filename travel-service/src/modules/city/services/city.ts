import { Injectable } from '@nestjs/common';
import { CityRepository } from '../database/city.repository';
import { CityEntity } from '../database/entities/city.entity';

@Injectable()
export class CityService {
  constructor(private readonly cityRepository: CityRepository) {}

  async getAllCities(countryId: number): Promise<CityEntity[]> {
    return await this.cityRepository.findAllByCountryId(countryId);
  }
}
