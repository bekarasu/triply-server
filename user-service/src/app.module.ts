import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CONFIGS, InfrasConfigModule } from './infrastructure/config';
import { InfrastructureTypeOrmModule } from './infrastructure/typeorm/typeorm.module';
import { LoggerModule } from './infrastructure/logger';
import { ConfigService } from '@nestjs/config';
import { ExceptionFilterModule } from './infrastructure/exception-filters';
import { RedisInfrasModule } from './infrastructure/redis';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { RequestTimeoutModule } from './infrastructure/request-timeout';
import { SerializationModule } from './infrastructure/serialization';
import { ProfileModule } from './modules/profile/profile.module';
import { SMTPModule } from './infrastructure/adapters/email';

@Module({
  imports: [
    InfrasConfigModule.forRoot({
      envFilePath: '.env',
    }),
    InfrastructureTypeOrmModule,
    RedisInfrasModule,
    RequestTimeoutModule,
    SerializationModule,
    ExceptionFilterModule.forRoot({
      service: 'user',
    }),
    LoggerModule.forRootAsync({
      type: 'console',
      configProvider: {
        useFactory: (configService: ConfigService) =>
          configService.get(CONFIGS.LOGGER),
        inject: [ConfigService],
      },
    }),
    SMTPModule.forRootAsync({
      useFactory: (configService: ConfigService) =>
        configService.get(CONFIGS.SMTP),
      inject: [ConfigService],
    }),
    AuthenticationModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
