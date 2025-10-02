import { CriteriaType } from '../../enums/criteria-type.enum';

export interface CreateCriteriaDto {
  criteriaName: string;
  criteriaType: CriteriaType;
  description?: string;
  validValues?: any[];
  defaultValue?: any;
  isActive?: boolean;
  sortOrder?: number;
  metadata?: Record<string, any>;
}
