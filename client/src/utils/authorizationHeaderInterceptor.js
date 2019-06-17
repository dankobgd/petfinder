export default function authorizationHeaderInterceptor(config) {
  let accessToken = localStorage.getItem('access_token');

  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return config;
}
