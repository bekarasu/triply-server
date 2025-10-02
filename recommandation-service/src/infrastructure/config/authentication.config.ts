import {
  UserAPIConfig,
  INTERNAL_API_CONFIG_PROVIDER,
  InternalAPIConfig,
  USER_API_CONFIG_PROVIDER,
} from '../authentication';
import CONFIGS from './config.constants';

export default () => ({
  [CONFIGS.AUTHENTICATION]: {
    [INTERNAL_API_CONFIG_PROVIDER]: {
      hashServerKey: process.env.SERVER_KEY,
      publicServerKey: process.env.PUBLIC_SERVER_KEY,
    } as InternalAPIConfig,
    [USER_API_CONFIG_PROVIDER]: {
      publicKey: process.env.AUTH_ACCESS_TOKEN_PUBLIC_KEY.replace(
        /\\n/gm,
        '\n',
      ),
      secretKey: process.env.JWT_TOKEN_SECRET,
      requestTimeout: parseInt(process.env.REQUEST_TIMEOUT_IN_MS) || 3000,
    } as UserAPIConfig,
  },
});
