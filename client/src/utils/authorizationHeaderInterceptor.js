export default function authorizationHeaderInterceptor(config) {
  let token = localStorage.getItem('access_token');

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
}
