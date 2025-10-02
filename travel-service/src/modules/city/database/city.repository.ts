import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { CityEntity } from './entities/city.entity';

export interface CitySearchOptions {
  query: string;
  countryId?: number;
  limit?: number;
  offset?: number;
  includeCountry?: boolean;
  sortBy?: 'relevance' | 'name' | 'population';
  sortOrder?: 'ASC' | 'DESC';
}

export interface CitySearchResult {
  cities: CityEntity[];
  total: number;
  hasMore: boolean;
}

@Injectable()
export class CityRepository {
  constructor(
    @InjectRepository(CityEntity)
    private readonly repository: Repository<CityEntity>,
  ) {}

  async findAllByCountryId(
    countryId: number,
    excludeList: number[] = [],
    capital?: string[],
    options?: {
      limit?: number;
      includeCountry?: boolean;
      sortBy?: 'priority' | 'population' | 'name';
    },
  ): Promise<CityEntity[]> {
    const queryBuilder = this.repository.createQueryBuilder('city');

    if (options?.includeCountry) {
      queryBuilder.leftJoinAndSelect('city.country', 'country');
    }

    queryBuilder
      .where('city.deletedAt IS NULL')
      .andWhere('city.countryId = :countryId', { countryId });

    if (excludeList && excludeList.length > 0) {
      queryBuilder.andWhere('city.id NOT IN (:...excludeList)', {
        excludeList,
      });
    }

    if (capital && capital.length > 0) {
      queryBuilder.andWhere('city.capital IN (:...capital)', { capital });
    }

    // Dynamic sorting
    switch (options?.sortBy) {
      case 'name':
        queryBuilder.orderBy('city.name', 'ASC');
        break;
      case 'population':
        queryBuilder.orderBy('city.population', 'DESC');
        break;
      case 'priority':
      default:
        queryBuilder
          .orderBy('city.priority', 'ASC')
          .addOrderBy('city.population', 'DESC');
        break;
    }

    if (options?.limit) {
      queryBuilder.limit(options.limit);
    }

    return await queryBuilder.getMany();
  }

  /**
   * ILIKE-based prefix search for autocomplete - Most commonly used
   * Best for: Autocomplete, prefix matching, fast typing
   */
  async searchCitiesPrefix(
    options: CitySearchOptions,
  ): Promise<CitySearchResult> {
    const {
      query,
      countryId,
      limit = 20,
      offset = 0,
      includeCountry = false,
    } = options;

    const searchTerm = `${query.toLowerCase()}%`;
    const queryBuilder = this.repository.createQueryBuilder('city');

    if (includeCountry) {
      queryBuilder
        .leftJoinAndSelect('city.country', 'country')
        .select(['country.name', 'country.iso2']);
    }

    queryBuilder.addSelect([
      'city.id',
      'city.name',
      'city.countryId',
      'city.population',
    ]);

    queryBuilder
      .where('city.deletedAt IS NULL')
      .andWhere(
        '(LOWER(city.name) LIKE :searchTerm OR LOWER(city.city_ascii) LIKE :searchTerm OR LOWER(city.admin_name) LIKE :searchTerm)',
        { searchTerm },
      );

    if (countryId) {
      queryBuilder.andWhere('city.countryId = :countryId', { countryId });
    }

    queryBuilder
      .addSelect(
        'CASE WHEN LOWER(city.name) LIKE :exactTerm THEN 1 WHEN LOWER(city.city_ascii) LIKE :exactTerm THEN 2 WHEN LOWER(city.admin_name) LIKE :exactTerm THEN 3 ELSE 4 END',
        'match_priority',
      )
      .setParameter('exactTerm', searchTerm);

    queryBuilder
      .orderBy('match_priority', 'ASC')
      .addOrderBy('city.population', 'DESC');

    const [cities, total] = await queryBuilder
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return {
      cities,
      total,
      hasMore: offset + cities.length < total,
    };
  }

  /**
   * Full-text search using PostgreSQL tsvector (requires migration)
   * Best for: Natural language queries, multiple words
   */
  async searchCitiesFullText(
    options: CitySearchOptions,
  ): Promise<CitySearchResult> {
    const {
      query,
      countryId,
      limit = 20,
      offset = 0,
      includeCountry = false,
      sortBy = 'relevance',
    } = options;

    const queryBuilder = this.repository.createQueryBuilder('city');

    if (includeCountry) {
      queryBuilder.leftJoinAndSelect('city.country', 'country');
    }

    queryBuilder
      .where('city.search_vector @@ plainto_tsquery(:query)', { query })
      .andWhere('city.deletedAt IS NULL');

    if (countryId) {
      queryBuilder.andWhere('city.countryId = :countryId', { countryId });
    }

    switch (sortBy) {
      case 'relevance':
        queryBuilder.orderBy(
          'ts_rank(city.search_vector, plainto_tsquery(:query))',
          'DESC',
        );
        break;
      case 'population':
        queryBuilder
          .orderBy('city.population', 'DESC')
          .addOrderBy('city.name', 'ASC');
        break;
      case 'name':
      default:
        queryBuilder.orderBy('city.name', 'ASC');
        break;
    }

    const [cities, total] = await queryBuilder
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return {
      cities,
      total,
      hasMore: offset + cities.length < total,
    };
  }

  /**
   * Trigram-based fuzzy search (requires pg_trgm extension)
   * Best for: Typos, partial words, similarity matching
   */
  async searchCitiesFuzzy(
    options: CitySearchOptions,
  ): Promise<CitySearchResult> {
    const {
      query,
      countryId,
      limit = 20,
      offset = 0,
      includeCountry = false,
    } = options;

    const queryBuilder = this.repository.createQueryBuilder('city');

    if (includeCountry) {
      queryBuilder.leftJoinAndSelect('city.country', 'country');
    }

    queryBuilder
      .where('city.deletedAt IS NULL')
      .andWhere(
        '(city.name % :query OR city.city_ascii % :query OR city.admin_name % :query)',
        { query },
      );

    if (countryId) {
      queryBuilder.andWhere('city.countryId = :countryId', { countryId });
    }

    queryBuilder
      .orderBy(
        'GREATEST(similarity(city.name, :query), similarity(city.city_ascii, :query), similarity(city.admin_name, :query))',
        'DESC',
      )
      .addOrderBy('city.population', 'DESC');

    const [cities, total] = await queryBuilder
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return {
      cities,
      total,
      hasMore: offset + cities.length < total,
    };
  }

  /**
   * Search cities by geographic proximity
   * Best for: Location-based searches
   */
  async searchCitiesByLocation(
    latitude: number,
    longitude: number,
    radiusKm: number = 50,
    limit: number = 20,
  ): Promise<CityEntity[]> {
    return await this.repository
      .createQueryBuilder('city')
      .where('city.deletedAt IS NULL')
      .andWhere('city.latitude IS NOT NULL AND city.longitude IS NOT NULL')
      .andWhere(
        '(6371 * acos(cos(radians(:lat)) * cos(radians(city.latitude)) * cos(radians(city.longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(city.latitude)))) <= :radius',
        {
          lat: latitude,
          lng: longitude,
          radius: radiusKm,
        },
      )
      .orderBy(
        '(6371 * acos(cos(radians(:lat)) * cos(radians(city.latitude)) * cos(radians(city.longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(city.latitude))))',
        'ASC',
      )
      .limit(limit)
      .getMany();
  }

  /**
   * Find capital cities by country
   * Best for: Getting capital cities specifically
   */
  async findCapitalsByCountryId(
    countryId: number,
    capitalTypes: string[] = ['primary', 'admin'],
  ): Promise<CityEntity[]> {
    return await this.repository.find({
      where: {
        deletedAt: null,
        countryId,
        capital: In(capitalTypes),
      },
      order: {
        priority: 'ASC',
        population: 'DESC',
      },
    });
  }

  /**
   * Find all capitals across countries
   * Best for: Getting all capital cities
   */
  async findAllCapitals(
    capitalTypes: string[] = ['primary', 'admin'],
    countryIds?: number[],
  ): Promise<CityEntity[]> {
    const whereCondition: any = {
      deletedAt: null,
      capital: In(capitalTypes),
    };

    if (countryIds && countryIds.length > 0) {
      whereCondition.countryId = In(countryIds);
    }

    return await this.repository.find({
      where: whereCondition,
      relations: ['country'],
      order: {
        priority: 'ASC',
        population: 'DESC',
      },
    });
  }

  /**
   * Get popular cities (by population) for suggestions
   * Best for: Default suggestions, popular destinations
   */
  // TODO add user community based popular cities
  async getPopularCities(
    countryId?: number,
    limit: number = 10,
  ): Promise<CityEntity[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('city')
      .leftJoinAndSelect('city.country', 'country')
      .select(['country.name', 'country.iso2'])
      .where('city.deletedAt IS NULL')
      .andWhere('city.capital = :capital or city.capital = :capital2', {
        capital: 'admin',
        capital2: 'primary',
      })
      .andWhere('city.population IS NOT NULL');

    queryBuilder.addSelect([
      'city.id',
      'city.name',
      'city.countryId',
      'city.population',
    ]);
    if (countryId) {
      queryBuilder.andWhere('city.countryId = :countryId', { countryId });
    }

    return await queryBuilder
      .orderBy('city.priority', 'ASC')
      .addOrderBy('city.population', 'DESC')
      .limit(limit)
      .getMany();
  }
}
