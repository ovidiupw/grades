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
  PROFESSORS: '/v1/professors',
  REGISTRATIONS: new RegExp(`\/v1\/(${bdsok(BasePaths, '|')})\/registrations`)
  STUDENTS: '/v1/students'
};

module.exports = Routes;
