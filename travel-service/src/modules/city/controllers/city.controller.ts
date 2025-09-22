import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { SuccessResponse } from '@src/libs/responses';
import { CityService, SearchCitiesRequest } from '../services/city';
import { UserAPI } from '@src/infrastructure/decorators';

@ApiTags('cities')
@Controller('cities')
@UserAPI()
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active cities' })
  @ApiResponse({ status: 200, description: 'List all active cities' })
  @ApiQuery({ name: 'countryId', required: false, type: Number })
  async getCities(
    @Query('countryId') countryId?: number,
  ): Promise<SuccessResponse<any>> {
    const cities = countryId
      ? await this.cityService.getAllCities(countryId)
      : [];

    return new SuccessResponse({
      message: 'Cities retrieved successfully',
      data: cities,
    });
  }

  @Get('search')
  @ApiOperation({ summary: 'Search cities with various strategies' })
  @ApiResponse({ status: 200, description: 'Search results for cities' })
  @ApiQuery({
    name: 'q',
    required: true,
    type: String,
    description: 'Search query',
  })
  @ApiQuery({ name: 'countryId', required: false, type: Number })
  @ApiQuery({
    name: 'searchType',
    required: false,
    enum: ['prefix', 'fulltext', 'fuzzy', 'auto'],
    description: 'Search strategy to use',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Max results',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Results offset',
  })
  @ApiQuery({
    name: 'includeCountry',
    required: false,
    type: Boolean,
    description: 'Include country data',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['relevance', 'name', 'population'],
    description: 'Sort results by',
  })
  async searchCities(
    @Query('q') query: string,
    @Query('countryId') countryId?: number,
    @Query('searchType') searchType?: 'prefix' | 'fulltext' | 'fuzzy' | 'auto',
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('includeCountry') includeCountry?: boolean,
    @Query('sortBy') sortBy?: 'relevance' | 'name' | 'population',
  ): Promise<SuccessResponse<any>> {
    if (!query || query.trim().length === 0) {
      return new SuccessResponse({
        message: 'Query parameter is required',
        data: { cities: [], total: 0, hasMore: false },
      });
    }

    const request: SearchCitiesRequest = {
      query,
      countryId,
      searchType: searchType || 'auto',
      limit: limit || 20,
      offset: offset || 0,
      includeCountry: includeCountry || false,
      sortBy: sortBy || 'relevance',
    };

    const result = await this.cityService.searchCities(request);

    return new SuccessResponse({
      message: `Found ${result.total} cities`,
      data: result,
    });
  }

  @Get('suggestions')
  @ApiOperation({ summary: 'Get city suggestions for autocomplete' })
  @ApiResponse({ status: 200, description: 'City suggestions' })
  @ApiQuery({
    name: 'q',
    required: false,
    type: String,
    description: 'Search query for suggestions',
  })
  @ApiQuery({ name: 'countryId', required: false, type: Number })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Max suggestions',
  })
  async getCitySuggestions(
    @Query('q') query?: string,
    @Query('countryId') countryId?: number,
    @Query('limit') limit?: number,
  ): Promise<SuccessResponse<any>> {
    const suggestions = await this.cityService.getCitySuggestions(
      query || '',
      countryId,
      limit || 10,
    );

    return new SuccessResponse({
      message: 'City suggestions retrieved successfully',
      data: suggestions,
    });
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get popular cities by population' })
  @ApiResponse({ status: 200, description: 'Popular cities' })
  @ApiQuery({ name: 'countryId', required: false, type: Number })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Max results',
  })
  async getPopularCities(
    @Query('countryId') countryId?: number,
    @Query('limit') limit?: number,
  ): Promise<SuccessResponse<any>> {
    const cities = await this.cityService.getPopularCities(
      countryId,
      limit || 10,
    );

    return new SuccessResponse({
      message: 'Popular cities retrieved successfully',
      data: cities,
    });
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Get cities near a location' })
  @ApiResponse({ status: 200, description: 'Nearby cities' })
  @ApiQuery({
    name: 'lat',
    required: true,
    type: Number,
    description: 'Latitude',
  })
  @ApiQuery({
    name: 'lng',
    required: true,
    type: Number,
    description: 'Longitude',
  })
  @ApiQuery({
    name: 'radius',
    required: false,
    type: Number,
    description: 'Search radius in km',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Max results',
  })
  async getCitiesNearLocation(
    @Query('lat') latitude: number,
    @Query('lng') longitude: number,
    @Query('radius') radius?: number,
    @Query('limit') limit?: number,
  ): Promise<SuccessResponse<any>> {
    if (!latitude || !longitude) {
      return new SuccessResponse({
        message: 'Latitude and longitude are required',
        data: [],
      });
    }

    const cities = await this.cityService.getCitiesNearLocation(
      latitude,
      longitude,
      radius || 50,
      limit || 20,
    );

    return new SuccessResponse({
      message: `Found ${cities.length} cities within ${radius || 50}km`,
      data: cities,
    });
  }

  @Get('advanced-search')
  @ApiOperation({
    summary: 'Advanced search with multiple fallback strategies',
  })
  @ApiResponse({ status: 200, description: 'Advanced search results' })
  @ApiQuery({
    name: 'q',
    required: true,
    type: String,
    description: 'Search query',
  })
  @ApiQuery({ name: 'countryId', required: false, type: Number })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Max results',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Results offset',
  })
  @ApiQuery({
    name: 'includeCountry',
    required: false,
    type: Boolean,
    description: 'Include country data',
  })
  async advancedSearch(
    @Query('q') query: string,
    @Query('countryId') countryId?: number,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('includeCountry') includeCountry?: boolean,
  ): Promise<SuccessResponse<any>> {
    if (!query || query.trim().length === 0) {
      return new SuccessResponse({
        message: 'Query parameter is required',
        data: { cities: [], total: 0, hasMore: false },
      });
    }

    const request: SearchCitiesRequest = {
      query,
      countryId,
      limit: limit || 20,
      offset: offset || 0,
      includeCountry: includeCountry || false,
    };

    const result = await this.cityService.advancedSearch(request);

    return new SuccessResponse({
      message: `Advanced search found ${result.total} cities`,
      data: result,
    });
  }
}
