import { OtpServiceConfig } from '@src/modules/authentication/services/otp.service';
import { CONFIGS } from '.';

export default () => ({
  [CONFIGS.OTP]: {
    otpExpirationTime: parseInt(
      process.env.OTP_EXPIRE_TIME_IN_SECONDS || '300',
    ),
    otpLength: parseInt(process.env.OTP_CODE_LENGTH || '6'),
    secret: process.env.OTP_JWT_SECRET,
  } as OtpServiceConfig,
});
