import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/libs/responses';
import { CriteriaDto } from '../dtos/responses/criteria.dto';
import { CriteriasDto } from '../dtos/responses/criterias.dto';
import { CriteriaService } from '../services/criteria.service';

@ApiTags('criterias')
@Controller('criterias')
export class CriteriaController {
  constructor(private readonly criteriaService: CriteriaService) {}

  @Get()
  @ApiOperation({ summary: 'Get all criterias' })
  @ApiResponse({ status: 200, description: 'List of all criterias' })
  async getAllCriterias(): Promise<SuccessResponse<CriteriasDto>> {
    const criterias = await this.criteriaService.getAllCriterias();

    return new SuccessResponse({
      message: 'Criterias retrieved successfully',
      data: new CriteriasDto(criterias),
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a criteria by ID' })
  @ApiResponse({ status: 200, description: 'Criteria found' })
  @ApiResponse({ status: 404, description: 'Criteria not found' })
  async getCriteriaById(
    @Param('id') id: string,
  ): Promise<SuccessResponse<CriteriaDto>> {
    const criteria = await this.criteriaService.getCriteriaById(id);

    return new SuccessResponse({
      message: 'Criteria retrieved successfully',
      data: new CriteriaDto(criteria),
    });
  }
}
