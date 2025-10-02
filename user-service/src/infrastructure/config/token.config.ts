import {
  AuthTokenServiceConfig,
  AUTH_TOKEN_SERVICE_CONFIG,
} from '@src/modules/token';

export default () => ({
  [AUTH_TOKEN_SERVICE_CONFIG]: {
    signTokenPrivateKey: process.env.AUTH_ACCESS_TOKEN_PRIVATE_KEY.replace(
      /\\n/gm,
      '\n',
    ),
    signTokenPublicKey: process.env.AUTH_ACCESS_TOKEN_PUBLIC_KEY.replace(
      /\\n/gm,
      '\n',
    ),
    refreshTokenExpiredIn: parseInt(process.env.REFRESH_TOKEN_EXPIRE_TIME),
    accessTokenExpiredIn: parseInt(process.env.ACCESS_TOKEN_EXPIRE_TIME),
  } as AuthTokenServiceConfig,
});
