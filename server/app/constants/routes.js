'use strict';

const Routes = {
  ANY: '/v1/*',
  ROOT: '/v1',
  REGISTER_IDENTITY: '/v1/register/identity',
  AUTH_FACEBOOK: '/v1/auth/facebook',
  AUTH_FACEBOOK_CALLBACK: '/v1/auth/facebook/callback',
  ROLES: '/v1/roles',
  REGISTRATIONS: '/v1/registrations'
};

module.exports = Routes;
