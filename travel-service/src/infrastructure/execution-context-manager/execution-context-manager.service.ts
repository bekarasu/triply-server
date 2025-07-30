import { AsyncLocalStorage } from 'async_hooks';
import { Injectable } from '@nestjs/common';
import { ExecutionContext } from './execution-context-manager.interfaces';

@Injectable()
export class ExecutionContextManager {
  private readonly contextStorage: AsyncLocalStorage<any>;

  constructor() {
    this.contextStorage = new AsyncLocalStorage();
  }

  get storage() {
    return this.contextStorage;
  }

  set(context: ExecutionContext, contextCallback?: () => void): void {
    if (contextCallback) {
      this.contextStorage.run(context, contextCallback);
    }
  }

  get() {
    return this.contextStorage.getStore();
  }
}
