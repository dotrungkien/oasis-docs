const AUTH_SERVER = 'https://auth.oasiscloud.io';

export const config = {
  authority: AUTH_SERVER,
  metadata: {
    issuer: AUTH_SERVER,
    authorization_endpoint: AUTH_SERVER + '/oauth/authorize',
    jwks_uri: AUTH_SERVER + '/oauth/keys',
    token_endpoint: AUTH_SERVER + '/oauth/token',
  },
  client_id: '33f630cc-9a64-493d-b71c-3b48e80ab177',
  redirect_uri: 'http://localhost:3000/callback',
  response_type: 'code',
  scope: 'openid',
  filterProtocolClaims: false,
  loadUserInfo: false,
  extraQueryParams: {
    audience: 'https://api.oasislabs.com/parcel',
  },
};
