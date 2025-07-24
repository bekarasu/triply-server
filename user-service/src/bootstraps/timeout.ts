import axios from 'axios';

export default () => {
  const axiosRequestTimeout =
    parseInt(process.env.APP_REQUEST_TIMEOUT || '0') * 1000;
  axios.defaults.timeout = axiosRequestTimeout;
};
