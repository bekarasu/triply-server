import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CountryEntity } from './entities/country.entity';

export interface CountrySearchOptions {
  query: string;
  limit?: number;
  offset?: number;
  sortBy?: 'relevance' | 'name';
}

export interface CountrySearchResult {
  countries: CountryEntity[];
  total: number;
  hasMore: boolean;
}

@Injectable()
export class CountryRepository {
  constructor(
    @InjectRepository(CountryEntity)
    private readonly repository: Repository<CountryEntity>,
  ) {}

  /**
   * ILIKE-based prefix search for countries
   * Best for: Autocomplete, prefix matching
   */
  async searchCountriesPrefix(
    options: CountrySearchOptions,
  ): Promise<CountrySearchResult> {
    const { query, limit = 20, offset = 0 } = options;

    const searchTerm = `${query.toLowerCase()}%`;
    const queryBuilder = this.repository.createQueryBuilder('country');

    queryBuilder
      .where('country.deletedAt IS NULL')
      .andWhere(
        '(LOWER(country.name) LIKE :searchTerm OR LOWER(country.iso2) LIKE :searchTerm OR LOWER(country.iso3) LIKE :searchTerm)',
        { searchTerm },
      );

    queryBuilder
      .orderBy(
        'CASE WHEN LOWER(country.name) LIKE :exactTerm THEN 1 WHEN LOWER(country.iso2) LIKE :exactTerm THEN 2 WHEN LOWER(country.iso3) LIKE :exactTerm THEN 3 ELSE 4 END',
        'ASC',
      )
      .addOrderBy('country.name', 'ASC')
      .setParameter('exactTerm', searchTerm);

    const [countries, total] = await queryBuilder
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return {
      countries,
      total,
      hasMore: offset + countries.length < total,
    };
  }

  /**
   * Full-text search for countries (requires migration)
   */
  async searchCountriesFullText(
    options: CountrySearchOptions,
  ): Promise<CountrySearchResult> {
    const { query, limit = 20, offset = 0, sortBy = 'relevance' } = options;

    const queryBuilder = this.repository.createQueryBuilder('country');

    queryBuilder
      .where('country.search_vector @@ plainto_tsquery(:query)', { query })
      .andWhere('country.deletedAt IS NULL');

    switch (sortBy) {
      case 'relevance':
        queryBuilder.orderBy(
          'ts_rank(country.search_vector, plainto_tsquery(:query))',
          'DESC',
        );
        break;
      case 'name':
      default:
        queryBuilder.orderBy('country.name', 'ASC');
        break;
    }

    const [countries, total] = await queryBuilder
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return {
      countries,
      total,
      hasMore: offset + countries.length < total,
    };
  }

  /**
   * Fuzzy search for countries (requires pg_trgm extension)
   */
  async searchCountriesFuzzy(
    options: CountrySearchOptions,
  ): Promise<CountrySearchResult> {
    const { query, limit = 20, offset = 0 } = options;

    const queryBuilder = this.repository.createQueryBuilder('country');

    queryBuilder
      .where('country.deletedAt IS NULL')
      .andWhere(
        '(country.name % :query OR country.iso2 % :query OR country.iso3 % :query)',
        { query },
      );

    queryBuilder
      .orderBy(
        'GREATEST(similarity(country.name, :query), similarity(country.iso2, :query), similarity(country.iso3, :query))',
        'DESC',
      )
      .addOrderBy('country.name', 'ASC');

    const [countries, total] = await queryBuilder
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return {
      countries,
      total,
      hasMore: offset + countries.length < total,
    };
  }

  async findAll(): Promise<CountryEntity[]> {
    return await this.repository.find({
      where: { deletedAt: null },
      order: { name: 'ASC' },
    });
  }

  async findByIsoCode(isoCode: string): Promise<CountryEntity | null> {
    const code = isoCode.toUpperCase();
    return await this.repository.findOne({
      where: [
        { iso2: code, deletedAt: null },
        { iso3: code, deletedAt: null },
      ],
    });
  }

  async findById(id: number): Promise<CountryEntity | null> {
    return await this.repository.findOne({
      where: { id, deletedAt: null },
    });
  }
}
