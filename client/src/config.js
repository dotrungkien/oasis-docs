const AUTH_SERVER = 'https://auth.oasiscloud.io';

export const config = {
  authority: AUTH_SERVER,
  metadata: {
    issuer: AUTH_SERVER,
    authorization_endpoint: AUTH_SERVER + '/oauth/authorize',
    jwks_uri: AUTH_SERVER + '/oauth/keys',
    token_endpoint: AUTH_SERVER + '/oauth/token',
  },
  client_id: 'db1864c1-a7a7-44bc-9f80-02fc7bc75e25',
  redirect_uri: 'https://oasis-docs.kiendt.me/callback',
  response_type: 'code',
  scope: 'openid',
  filterProtocolClaims: false,
  loadUserInfo: false,
  extraQueryParams: {
    audience: 'https://api.oasislabs.com/parcel',
  },
};
