'use strict';

const Utility = require('../modules/utility');
const bdsok = Utility.buildDelimiterSeparatedObjectKeys;

const BasePaths = {
  STUDENTS: 'students',
  PROFESSORS: 'professors',
  ADMINISTRATORS: 'administrators'
};

const Routes = {
  ANY: '/v1/*',
  ROOT: '/v1',
  
  REGISTER_IDENTITY: '/v1/register/identity',
  
  AUTH_FACEBOOK: '/v1/auth/facebook',
  AUTH_FACEBOOK_CALLBACK: '/v1/auth/facebook/callback',
  
  ROLES: '/v1/roles',
  REGISTRATIONS: new RegExp(`\/v1\/(${bdsok(BasePaths, '|')})\/registrations`)
};

module.exports = Routes;
