'use strict';

let async = require('async');
let RequestValidator = require('../../modules/request-validator');

const RouteNames = require('../../constants/routes');
const HttpVerbs = require('../../constants/http-verbs');

let User = require('../../entities/user');
let Role = require('../../entities/role');

let AddNewRole = {
  invoke: function (req, res, next) {
    async.waterfall([

      function (callback) {
        RequestValidator.validateRequest(req, RouteNames.ROLES, HttpVerbs.POST, function (error) {
          if (error) {
            callback(error);
          } else {
            callback(null);
          }
        });
      },

      function (callback) {
        User.model.findByUser(req.body.user,
          function (foundUser) {
            callback(null, foundUser);
          },
          function (error) {
            callback(error);
          }
        );
      },

      function (foundUser, callback) {
        RequestValidator.validateApiKey(foundUser, req.body.apiKey, function (error) {
          if (error) {
            callback(error);
          } else {
            callback(null, foundUser);
          }
        });
      },

      /* User credentials are valid at this point - authenticate */

      function (foundUser, callback) {
        let _err = false;
        RequestValidator.validateAccessRights(
          foundUser, RouteNames.ROLES, HttpVerbs.POST,
          function (error) {
            if (error) {
              /* In case user does not have permissions to access this resource */
              callback(error);
            } else {
              callback(null);
            }
          });
      },

      /* User has permission to access the resource at this point - authorized */

      function (callback) {
        let newRole = new Role.model({
          title: req.body.title,
          actions: req.body.actions
        });

        let _err = false;
        newRole.save(function (error) {
          if (error) {
            callback(error);
          } else {
            callback(null);
          }
        });
      },

      function (callback) {
        /* If it reaches this, the request succeeded. */
        res.status(200);
        res.send();
      }

    ], function (err, results) {
      if (err) {
        res.status(400);
        res.send(err);
      }
    });

  }
};

module.exports = AddNewRole;
