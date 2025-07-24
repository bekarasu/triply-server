import { RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import CONFIGS from './config.constants';

export default () => ({
  [CONFIGS.REDIS]: {
    config: [
      {
        url: `redis://${process.env.REDIS_CONNECTION_STRING}`,
        reconnectOnError: () => 2,
      },
      {
        url: `redis://${process.env.REDIS_CONNECTION_STRING}`,
        namespace: CONFIGS.AUTHENTICATION,
        reconnectOnError: () => 2,
      },
      {
        url: `redis://${process.env.REDIS_CONNECTION_STRING}`,
        namespace: 'request-token.storage',
        reconnectOnError: () => 2,
      },
      // Add more redis clients here based on your need, example below:
      // {
      // 	url: `redis://${process.env.REDIS_CONNECTION_STRING}`,
      // 	name: 'your client name',
      // 	reconnectOnError: () => 2,
      // 	readOnly: true, // <--------- Read only?
      //  ...more option here,
      // }
    ],
  } as RedisModuleOptions,
});
