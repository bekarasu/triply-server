import { Injectable } from '@nestjs/common';
import { CityService } from '@src/modules/city/services/city.service';
import { UserTripEntity } from '../database/entities/user-trip.entity';
import { UserTripRepository } from '../database/user-trip.repository';
import { CreateUserTripDto, UserTripResponseDto } from '../dto';
import { InvalidCityException } from '../trip.errors';

@Injectable()
export class UserTripService {
  constructor(
    private readonly tripRepository: UserTripRepository,
    private readonly cityService: CityService,
  ) {}

  async create(createData: CreateUserTripDto): Promise<UserTripResponseDto> {
    const cities = await this.cityService.getCitiesByIds(
      createData.destinations.map((d) => d.cityId),
    );
    if (cities.length !== createData.destinations.length) {
      throw new InvalidCityException();
    }

    const tripDataEntity = createData.toUserTripEntity();
    const tripData = await this.tripRepository.create(tripDataEntity);

    return { id: tripData.id };
  }
}
