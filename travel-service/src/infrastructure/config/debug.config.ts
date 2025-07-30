import { DEBUG_CONFIG } from '../infrastructure.common';

export default () => {
  return {
    [DEBUG_CONFIG]: {
      enableSwagger: process.env.DEBUG_ENABLE_SWAGGER === '1' ? true : false,
      enableUtilities:
        process.env.DEBUG_ENABLE_UTILITIES === '1' ? true : false,
    },
  };
};
