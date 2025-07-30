import { LoggerConfig } from '../logger';
import CONFIGS from './config.constants';

export default () => ({
  [CONFIGS.LOGGER]: {
    type: 'console',
    levels: ['log'],
    defaultContext: 'APP',
    appId: process.env.LOGGER_APP_ID,
    platformConfig: {},
    printTrace: process.env.LOGGER_PRINT_TRACE ? true : false,
    logHealthcheck: process.env.DEBUG_ENABLE_HEALTHCHECK_LOG === '1',
  } as LoggerConfig,
});
