import Axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

export const AXIOS_INSTANCE = Axios.create(); // use your own URL here or environment variable
 
// add a second `options` argument here if you want to pass extra options to each generated query
export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
  const source = Axios.CancelToken.source();
  const promise: Promise<T> = AXIOS_INSTANCE({
    baseURL: VITE_API_BASE_URL,
    ...config,
    ...options,
    cancelToken: source.token,
  }).then((response: AxiosResponse<T>) => response.data);

  // @ts-expect-error('promise.cancel')
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

export default customInstance;