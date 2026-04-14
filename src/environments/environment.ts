/* eslint-disable prettier/prettier */

const API_ENV = {
  production: true,
  protocol: 'https',
  domain: 'localhost',
  port: '5208',
  gateway: 'api',
};

export const API_URL: string =
  `${API_ENV.protocol}://` +
  `${API_ENV.domain}` +
  `${API_ENV.port ? ':' + API_ENV.port : ''}` +
  `/${API_ENV.gateway}`;
