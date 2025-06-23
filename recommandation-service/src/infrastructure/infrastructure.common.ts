export const isDevelopment = () =>
  ['local', 'alpha', 'beta', 'qualif', 'dev'].includes(process.env.ENV);

export const loadENVFromFile = () =>
  process.env.LOAD_ENV_FILE ? `env/.env-${process.env.ENV}` : undefined;

export {
  APP_LOGGER,
  RQEUEST_LOGGER,
  IRequestLogger,
  IAppLogger,
  LoggerFactory,
} from './logger';
export { ExecutionContextManager } from './execution-context-manager';

export const DEBUG_CONFIG = 'DEBUG.CONFIG';
