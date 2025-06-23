import {
  REQUEST_TIMEOUT_CONFIG,
  RequestTimeoutConfig,
} from '../request-timeout';

export default () => ({
  [REQUEST_TIMEOUT_CONFIG]: {
    timeoutInMs: parseInt(process.env.REQUEST_TIMEOUT_IN_MS || '60000'),
  } as RequestTimeoutConfig,
});
