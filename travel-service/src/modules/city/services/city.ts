import { Injectable } from '@nestjs/common';
import {
  CityRepository,
  CitySearchOptions,
  CitySearchResult,
} from '../database/city.repository';
import { CityEntity } from '../database/entities/city.entity';

export interface SearchCitiesRequest {
  query: string;
  countryId?: number;
  searchType?: 'prefix' | 'fulltext' | 'fuzzy' | 'auto';
  limit?: number;
  offset?: number;
  includeCountry?: boolean;
  sortBy?: 'relevance' | 'name' | 'population';
}

@Injectable()
export class CityService {
  constructor(private readonly cityRepository: CityRepository) {}

  async getAllCities(countryId: number): Promise<CityEntity[]> {
    return await this.cityRepository.findAllByCountryId(countryId);
  }

  /**
   * Smart search that automatically chooses the best search strategy
   */
  async searchCities(request: SearchCitiesRequest): Promise<CitySearchResult> {
    const { searchType = 'auto', query } = request;

    const options: CitySearchOptions = {
      query: query.trim(),
      countryId: request.countryId,
      limit: request.limit || 20,
      offset: request.offset || 0,
      includeCountry: request.includeCountry || false,
      sortBy: request.sortBy || 'relevance',
    };

    if (!options.query || options.query.length < 1) {
      return { cities: [], total: 0, hasMore: false };
    }

    if (searchType === 'auto') {
      if (options.query.length <= 2) {
        return await this.cityRepository.searchCitiesPrefix(options);
      }

      if (options.query.includes(' ') && options.query.length > 4) {
        return await this.cityRepository.searchCitiesFullText(options);
      }

      return await this.cityRepository.searchCitiesPrefix(options);
    }

    switch (searchType) {
      case 'prefix':
        return await this.cityRepository.searchCitiesPrefix(options);
      case 'fulltext':
        return await this.cityRepository.searchCitiesFullText(options);
      case 'fuzzy':
        return await this.cityRepository.searchCitiesFuzzy(options);
      default:
        return await this.cityRepository.searchCitiesPrefix(options);
    }
  }

  /**
   * Get city suggestions for autocomplete
   */
  async getCitySuggestions(
    query: string,
    countryId?: number,
    limit: number = 10,
  ): Promise<CityEntity[]> {
    if (!query || query.length < 1) {
      return await this.getPopularCities(countryId, limit);
    }

    const result = await this.cityRepository.searchCitiesPrefix({
      query: query.trim(),
      countryId,
      limit,
      offset: 0,
      includeCountry: false,
      sortBy: 'population',
    });

    return result.cities;
  }

  /**
   * Get popular cities for default suggestions
   */
  async getPopularCities(
    countryId?: number,
    limit: number = 10,
  ): Promise<CityEntity[]> {
    return await this.cityRepository.getPopularCities(countryId, limit);
  }

  /**
   * Search cities near a specific location
   */
  async getCitiesNearLocation(
    latitude: number,
    longitude: number,
    radiusKm: number = 50,
    limit: number = 20,
  ): Promise<CityEntity[]> {
    return await this.cityRepository.searchCitiesByLocation(
      latitude,
      longitude,
      radiusKm,
      limit,
    );
  }

  /**
   * Advanced search with multiple filters and fallbacks
   */
  async advancedSearch(
    request: SearchCitiesRequest,
  ): Promise<CitySearchResult> {
    const { query } = request;

    if (!query || query.trim().length < 1) {
      const popularCities = await this.getPopularCities(
        request.countryId,
        request.limit || 20,
      );
      return {
        cities: popularCities,
        total: popularCities.length,
        hasMore: false,
      };
    }

    const result = await this.searchCities({
      ...request,
      searchType: 'prefix',
    });

    if (result.cities.length < (request.limit || 20) / 2 && query.length > 2) {
      const fullTextResult = await this.searchCities({
        ...request,
        searchType: 'fulltext',
      });

      const existingIds = new Set(result.cities.map((city) => city.id));
      const newCities = fullTextResult.cities.filter(
        (city) => !existingIds.has(city.id),
      );

      result.cities.push(...newCities);
      result.total = Math.max(result.total, fullTextResult.total);
    }

    if (result.cities.length < (request.limit || 20) / 2 && query.length > 1) {
      const fuzzyResult = await this.searchCities({
        ...request,
        searchType: 'fuzzy',
      });

      const existingIds = new Set(result.cities.map((city) => city.id));
      const newCities = fuzzyResult.cities.filter(
        (city) => !existingIds.has(city.id),
      );

      result.cities.push(...newCities);
      result.total = Math.max(result.total, fuzzyResult.total);
    }

    const finalLimit = request.limit || 20;
    result.cities = result.cities.slice(0, finalLimit);
    result.hasMore = result.total > finalLimit;

    return result;
  }
}
