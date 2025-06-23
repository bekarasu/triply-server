import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ExecutionContextManagerMiddleware } from './execution-context-manager.middleware';
import { ExecutionContextManager } from './execution-context-manager.service';

@Global()
@Module({
  providers: [ExecutionContextManager],
  exports: [ExecutionContextManager],
})
export class ExecutionContextManagerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ExecutionContextManagerMiddleware).forRoutes('*');
  }
}
