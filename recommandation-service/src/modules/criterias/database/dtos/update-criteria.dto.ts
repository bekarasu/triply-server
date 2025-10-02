import { CriteriaType } from '../../enums/criteria-type.enum';

export interface UpdateCriteriaDto {
  criteriaName?: string;
  criteriaType?: CriteriaType;
  description?: string;
  validValues?: any[];
  defaultValue?: any;
  isActive?: boolean;
  sortOrder?: number;
  metadata?: Record<string, any>;
}
