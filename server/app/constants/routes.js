'use strict';

const BasePaths = {
  STUDENTS: 'students',
  PROFESSORS: 'professors',
  ADMINISTRATORS: 'administrators',
  API_V1: 'v1'
};

const Routes = {
  ANY: `/${BasePaths.API_V1}/*`,
  ROOT: `/${BasePaths.API_V1}`,
  API_RESOURCES: `/${BasePaths.API_V1}/resources`,
  
  REGISTER_IDENTITY: `/${BasePaths.API_V1}/register/identity`,
  
  AUTH_FACEBOOK: `/${BasePaths.API_V1}/auth/facebook`,
  AUTH_FACEBOOK_CALLBACK: `/${BasePaths.API_V1}/auth/facebook/callback`,
  
  ROLES: `/${BasePaths.API_V1}/roles`,
  PROFESSORS: `/${BasePaths.API_V1}/${BasePaths.PROFESSORS}`,
  REGISTRATIONS: `/${BasePaths.API_V1}/registrations`,
  STUDENTS: `/${BasePaths.API_V1}/${BasePaths.STUDENTS}`
};

module.exports = Routes;
