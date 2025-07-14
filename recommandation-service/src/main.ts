import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import setupSwagger from './bootstraps/swagger';
import setupTimeout from './bootstraps/timeout';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);
  setupTimeout();
  console.log(process.env.SERVICE_NAME)
  app.setGlobalPrefix(process.env.SERVICE_NAME);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
