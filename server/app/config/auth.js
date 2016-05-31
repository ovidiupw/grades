'use strict';

const RouteNames = require('../constants/routes');

let Auth = {
  facebookAuth: {
    appId: '848873811924114',
    appSecret: '06393a0e1660d0f52a7fc2f168fe3a0d',
    callbackURL:  RouteNames.AUTH_FACEBOOK_CALLBACK
  }
};

module.exports = Auth;
