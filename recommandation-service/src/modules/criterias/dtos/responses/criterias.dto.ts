import { CriteriaEntity } from '../../database/entities/criteria.entity';
import { CriteriaDto } from './criteria.dto';

export class CriteriasDto extends Array<CriteriaDto> {
  constructor(criterias: CriteriaEntity[]) {
    super(
      ...criterias.map((criteria) => {
        return new CriteriaDto({
          id: criteria.id,
          name: criteria.name,
          icon: criteria.icon,
          description: criteria.description,
          metadata: criteria.metadata,
          category: criteria.category,
        });
      }),
    );
  }
}
