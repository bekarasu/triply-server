import axios from 'axios';

export default () => {
  const axiosRequestTimeout = parseInt(
    process.env.APP_REQUEST_TIMEOUT_IN_MS || '0',
  );
  axios.defaults.timeout = axiosRequestTimeout;
};
