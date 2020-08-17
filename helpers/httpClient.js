import axios from 'axios';
import * as AxiosLogger from 'axios-logger';

export const httpClient = axios.create();
if (process.env.NODE_ENV !== 'test') {
  httpClient.interceptors.request.use(AxiosLogger.requestLogger, AxiosLogger.errorLogger);
  httpClient.interceptors.response.use(AxiosLogger.responseLogger, AxiosLogger.errorLogger);
}
