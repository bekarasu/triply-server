import { ApiProperty } from '@nestjs/swagger';
import { CriteriaType } from '../../enums/criteria-type.enum';

export class CriteriaDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: CriteriaType })
  description: CriteriaType;

  @ApiProperty()
  icon: string;

  @ApiProperty()
  category: any[];

  constructor(props) {
    this.id = props.id || '';
    this.name = props.name || '';
    this.icon = props.icon || '';
    this.description = props.description || '';
    this.category = props.category || '';
  }
}
