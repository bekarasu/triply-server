import { EntityPropsInvalidException } from '../../exceptions';
import { Guard } from '../guard';
import { DateVO, ID } from '../value-objects';
import { ValueObject } from './value-object.base';

export interface IEntity<EntityProps> {
  get id(): ID;
  get createdAt(): DateVO;
  get updatedAt(): DateVO;
  equals(object?: Entity<EntityProps>): boolean;
  toObject(): unknown;
  getPropsCopy(): EntityProps & BaseEntityProps;
  validate(): void;
}

export interface BaseEntityProps {
  id: ID;
  createdAt: DateVO;
  updatedAt: DateVO;
}

export interface CreateEntityProps<T> {
  id: ID;
  props: T;
  createdAt?: DateVO;
  updatedAt?: DateVO;
}

export abstract class Entity<EntityProps> implements IEntity<EntityProps> {
  protected readonly props: EntityProps;
  // ID is set in the entity to support different ID types
  protected abstract _id: ID;
  private readonly _createdAt: DateVO;
  protected _updatedAt: DateVO;

  constructor({
    id,
    createdAt,
    updatedAt,
    props,
  }: CreateEntityProps<EntityProps>) {
    this.setId(id);
    this.validateProps(props);
    const now = DateVO.now();
    this._createdAt = createdAt || now;
    this._updatedAt = updatedAt || now;
    this.props = props;
    this.validate();
  }

  get id(): ID {
    return this._id;
  }

  private setId(id: ID): void {
    this._id = id;
  }

  get createdAt(): DateVO {
    return this._createdAt;
  }

  get updatedAt(): DateVO {
    return this._updatedAt;
  }

  static isEntity(entity: unknown): entity is Entity<unknown> {
    return entity instanceof Entity;
  }

  /**
   *  Check if two entities are the same Entity. Checks using ID field.
   * @param object Entity
   */
  public equals(object?: IEntity<EntityProps>): boolean {
    if (object === null || object === undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!Entity.isEntity(object)) {
      return false;
    }
    return this._id.equals(object.id);
  }

  /**
   * Returns current **copy** of entity's props.
   * Modifying entity's state won't change previously created
   * copy returned by this method since it doesn't return a reference.
   * If a reference to a specific property is needed create a getter in parent class.
   *
   * @return {*}  {Props & EntityProps}
   * @memberof Entity
   */
  public getPropsCopy(): EntityProps & BaseEntityProps {
    const propsCopy = {
      id: this._id,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      ...this.props,
    };
    return Object.freeze(propsCopy);
  }

  /**
   * Convert an Entity and all sub-entities/Value Objects it
   * contains to a plain object with primitive types. Can be
   * useful when logging an entity during testing/debugging
   */
  public toObject(): unknown {
    const plainProps = this.props;
    const result = {
      id: this._id.value,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      ...plainProps,
    };
    Object.keys(plainProps).forEach((propKey) => {
      if (ValueObject.isValueObject(plainProps[propKey])) {
        result[propKey] = plainProps[propKey].value;
      }
    });
    return Object.freeze(result);
  }

  /**
   * Validate invariant. This method will be called by repository right berfore it saves the entity data to DB
   */
  public abstract validate(): void;

  private validateProps(props: EntityProps): void {
    const maxProps = 50;

    if (Guard.isEmpty(props)) {
      throw new EntityPropsInvalidException('Entity props should not be empty');
    }
    if (typeof props !== 'object') {
      throw new EntityPropsInvalidException('Entity props should be an object');
    }
    if (Object.keys(props).length > maxProps) {
      throw new EntityPropsInvalidException(
        `Entity props should not have more than ${maxProps} properties`,
      );
    }
  }
}
