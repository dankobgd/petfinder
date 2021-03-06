import axios from 'axios';
import authHeaderInterceptor from './authorizationHeaderInterceptor';

const baseURL = process.env.BASE_URL;

const client = axios.create({
  baseURL: `${baseURL}/api`,
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
    Accept: 'application/json',
  },
  timeout: 6000,
});

client.interceptors.request.use(authHeaderInterceptor);

function formatURL(url) {
  const adjusted = url[0] === '/' ? url.substring(1) : url;
  return adjusted;
}

function request(method, url, config = {}, options = {}) {
  const { params, data, headers, maxContentLength } = config;
  const { raw } = options;

  const onSuccess = response => (raw || method === 'HEAD' ? response : response.data);
  const onError = error => error.response;

  return new Promise((resolve, reject) => {
    return client
      .request({
        method,
        url: formatURL(url),
        params,
        data,
        headers,
        maxContentLength,
      })
      .then(res => resolve(onSuccess(res)))
      .catch(err => reject(onError(err)));
  });
}

const apiClient = {
  get: (url, config, options) => {
    return request('GET', url, config, options);
  },
  post: (url, config, options) => {
    return request('POST', url, config, options);
  },
  put: (url, config, options) => {
    return request('PUT', url, config, options);
  },
  patch: (url, config, options) => {
    return request('PATCH', url, config, options);
  },
  del: (url, config, options) => {
    return request('DELETE', url, config, options);
  },
  head: (url, config, options) => {
    return request('HEAD', url, config, options);
  },
};

export default apiClient;
