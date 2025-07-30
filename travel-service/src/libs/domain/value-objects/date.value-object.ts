import { ArgumentInvalidException } from '../../exceptions';
import { DomainPrimitive, ValueObject } from '../base/value-object.base';

export class DateVO extends ValueObject<Date | any> {
  public static readonly UNDETERMINED = new DateVO(0);

  constructor(value: Date | string | number) {
    const date = new Date(value);
    super({ value: date });
  }

  public get isUndetermined() {
    return this.value.getTime() === DateVO.UNDETERMINED.value.getTime();
  }

  public static now(): DateVO {
    return new DateVO(Date.now());
  }

  protected validate({ value }: DomainPrimitive<Date>): void {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      throw new ArgumentInvalidException('Incorrect date');
    }
  }
}
