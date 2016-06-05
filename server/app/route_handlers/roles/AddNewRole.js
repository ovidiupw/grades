'use strict';

let async = require('async');
let RequestValidator = require('../../modules/request-validator');
let ActionValidator = require('../../modules/action-validator');
let AuthorizationHelper = require('../../modules/authorization');

const RouteNames = require('../../constants/routes');
const HttpVerbs = require('../../constants/http-verbs');

let User = require('../../entities/user');
let Role = require('../../entities/role');
let Roles = require('../../constants/roles');
let Utility = require('../../modules/utility');

let PredefinedErrors = require('../../modules/predefined-errors');

/**
 * Use invoke() method of this closure to create (POST) a new role.
 */
let AddNewRole = (function () {

  let _validateRequest = function (req, errCallback) {

    process.nextTick(() => {
      if (!RequestValidator.bodyIsValid(req.body)) {
        return errCallback(PredefinedErrors.getInvalidBodyError());
      }
      if (!RequestValidator.requestContainsAuthenticationData(req)) {
        return errCallback(PredefinedErrors.getAuthorizationDataNotFoundError());
      }
      if (req.body.title == undefined || req.body.actions == undefined) {
        return errCallback(PredefinedErrors.getInvalidBodyError(
          "Required parameters not supplied. Please add " +
          "'title' and 'actions' to your request."));
      }

      let err = ActionValidator.validateRequestActions(req.body.actions);
      if (err != null) {
        return errCallback(err);
      }

      return errCallback(null);
    });
  };

  let _validateRequest_waterfall = function (callback) {
    _validateRequest(_receivedRequest, function (invalidRequestError) {
      if (invalidRequestError) {
        return callback(invalidRequestError);
      } else {
        return callback(null, _receivedRequest.body.user);
      }
    });
  };

  let _saveRole_waterfall = function(ignored, callback) {
    let newRole = new Role.model({
      title: _receivedRequest.body.title,
      actions: _receivedRequest.body.actions
    });

    newRole.save(function (roleSaveError) {
      if (roleSaveError) {
        callback(PredefinedErrors.getDatabaseOperationFailedError(roleSaveError));
      } else {
        callback(null);
      }
    });
  };

  let _receivedRequest;
  let _setReceivedRequest = function(req) {
    _receivedRequest = req;
  };
  
  let _invoke = function (req, res) {
    _receivedRequest = req;

    AuthorizationHelper.setUserAndApiKey({
      user: req.body.user,
      apiKey: req.body.apiKey
    });

    AuthorizationHelper.setCurrentResourceAndVerb({
      resource: RouteNames.ROLES,
      verb: HttpVerbs.POST
    });

    async.waterfall([
      
      _validateRequest_waterfall,
      AuthorizationHelper.findUserInDatabase,
      AuthorizationHelper.validateUserApiKey,
      AuthorizationHelper.validateAccessRights,
      _saveRole_waterfall

    ], function (err, results) {
      if (err) {
        res.status(400);
        res.send(err);
      } else {
        res.status(200);
        res.send();
      }
    });

  };

  return {
    invoke: _invoke,

    _validateRequest: _validateRequest,
    _validateRequest_waterfall: _validateRequest_waterfall,
    _saveRole_waterfall: _saveRole_waterfall,
    _setReceivedRequest: _setReceivedRequest
  }
})();

module.exports = AddNewRole;
