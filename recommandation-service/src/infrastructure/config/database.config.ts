import { DataSourceOptions } from 'typeorm';
import { isDevelopment } from '../infrastructure.common';
import CONFIGS from './config.constants';

export default () => ({
  [CONFIGS.TYPEORM]: {
    type: 'postgres',
    url: process.env.DATABASE_CONNECTION_STRING,
    autoLoadEntities: true,
    logging: isDevelopment(),
  } as DataSourceOptions,
});
