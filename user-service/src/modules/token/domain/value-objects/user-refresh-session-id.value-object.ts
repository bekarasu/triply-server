import { ID } from '@src/libs/domain';
import { v4 as uuidV4 } from 'uuid';

export class UserRefreshSessionID extends ID<string> {
  protected validate(): void {
    return;
  }

  /**
   *Returns new UserRefreshSessionID instance with randomly generated ID value
   * @static
   * @return {UserRefreshSessionID}
   */
  static generate(): UserRefreshSessionID {
    return new UserRefreshSessionID(uuidV4());
  }

  /**
   * Returns an instance of UserRefreshSessionID based on primitive UUID value
   * @static
   * @return {UserRefreshSessionID}
   */
  static create(value: string): UserRefreshSessionID {
    return new UserRefreshSessionID(value);
  }
}
