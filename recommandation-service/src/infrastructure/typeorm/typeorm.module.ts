import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import CONFIGS from '../config/config.constants';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return configService.get(CONFIGS.TYPEORM);
      },
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class InfrastructureTypeOrmModule {}
