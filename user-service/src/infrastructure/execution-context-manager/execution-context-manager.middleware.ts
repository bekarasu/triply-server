import { Injectable, NestMiddleware } from '@nestjs/common';
import { ExecutionContext } from './execution-context-manager.interfaces';
import { ExecutionContextManager } from './execution-context-manager.service';

@Injectable()
export class ExecutionContextManagerMiddleware implements NestMiddleware {
  constructor(private readonly manager: ExecutionContextManager) {}
  use(req: any, res: any, next: (error?: any) => void) {
    const context = {
      getRequest: () => req,
      getResponse: () => res,
    } as ExecutionContext;
    this.manager.set(context, next);
  }
}
