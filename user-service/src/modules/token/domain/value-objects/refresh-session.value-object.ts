import { ValueObject } from '@libs/domain/base/value-object.base';
import { v4 as uuidV4 } from 'uuid';

export interface RefreshSessionProps {
  refreshSession: string;
}

export class RefreshSession extends ValueObject<RefreshSessionProps> {
  get refreshSession() {
    return this.props.refreshSession;
  }

  protected validate(): void {
    return;
  }

  static init(refreshSession: string) {
    return new RefreshSession({
      refreshSession,
    });
  }
  static generate(): RefreshSession {
    return RefreshSession.create({ refreshSession: uuidV4() });
  }

  static create(props: RefreshSessionProps) {
    return new RefreshSession(props);
  }
}
