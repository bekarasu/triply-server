import {
  DomainPrimitive,
  Primitives,
  ValueObject,
} from '../base/value-object.base';

/**
 * An abstract class used to represent an ID of entity or aggregate. The type of ID is primitive (number, string, boolean).
 */
export abstract class ID<T extends Primitives = Primitives> extends ValueObject<
  DomainPrimitive<T>
> {
  constructor(value: T) {
    super({ value });
  }

  protected abstract validate({ value }: DomainPrimitive<Primitives>): void;
}
