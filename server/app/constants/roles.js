'use strict';

const RouteNames = require('./routes');
const HttpVerbs = require('./http-verbs');

const Roles = {
  administrator: {
    title: 'administrator',
    actions: [
      {
        verb: HttpVerbs.GET,
        resource: RouteNames.ANY
      },
      {
        verb: HttpVerbs.PUT,
        resource: RouteNames.ANY
      },
      {
        verb: HttpVerbs.POST,
        resource: RouteNames.ANY
      },
      {
        verb: HttpVerbs.DELETE,
        resource: RouteNames.ANY
      },
      {
        verb: HttpVerbs.PATCH,
        resource: RouteNames.ANY
      }
    ]
  }
};

module.exports = Roles;
