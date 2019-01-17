import axios from 'axios';
import axiosLogger from 'axios-logger';

export const httpClient = axios.create();
if (process.env.NODE_ENV !== 'test') {
  httpClient.interceptors.request.use(axiosLogger.requestLogger, axiosLogger.errorLogger);
  httpClient.interceptors.response.use(axiosLogger.responseLogger, axiosLogger.errorLogger);
}
