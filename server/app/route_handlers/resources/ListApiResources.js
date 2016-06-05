'use strict';

let async = require('async');
let RequestValidator = require('../../modules/request-validator');
let AuthorizationHelper = require('../../modules/authorization');

const RouteNames = require('../../constants/routes');
const HttpVerbs = require('../../constants/http-verbs');

let PredefinedErrors = require('../../modules/predefined-errors');

let ListApiResources = (function () {
  
  let _validateRequest = function (req, errCallback) {
    process.nextTick(() => {
      if (!RequestValidator.headerIsValid(req.headers)) {
        return errCallback(PredefinedErrors.getInvalidHeaderError());
      }
      if (!RequestValidator.requestHeaderContainsAuthenticationData(req)) {
        return errCallback(PredefinedErrors.getAuthorizationDataNotFoundError());
      }
      return errCallback(null);
    });
  };
  
  let _validateRequest_waterfall = function(callback) {
    _validateRequest(_receivedRequest, function (invalidRequestError) {
      if (invalidRequestError) {
        return callback(invalidRequestError);
      } else {
        return callback(null, _receivedRequest.headers['user']);
      }
    });
  };
  
  let _listApiResources_waterfall = function(ignored, callback) {
      let apiResources = [];
      for (let routeName in RouteNames) {
        if (RouteNames.hasOwnProperty(routeName)) {
          apiResources.push(RouteNames[routeName]);
        }
      }
      callback(null, apiResources)
  };
  
  let _receivedRequest;
  let _invoke = function (req, res) {
    /* use closure instance variable to avoid passing req to each extracted waterfall function */
    _receivedRequest = req;

    AuthorizationHelper.setUserAndApiKey({
      user: req.headers.user,
      apiKey: req.headers.apikey
    });

    AuthorizationHelper.setCurrentResourceAndVerb({
      resource: RouteNames.API_RESOURCES,
      verb: HttpVerbs.GET
    });

    async.waterfall([

      _validateRequest_waterfall,
      AuthorizationHelper.findUserInDatabase,
      AuthorizationHelper.validateUserApiKey,
      AuthorizationHelper.validateAccessRights,
      _listApiResources_waterfall

    ], function (err, apiResources) {
      if (err) {
        res.status(400);
        res.send(err);
      } else {
        res.status(200);
        res.send(apiResources)
      }
    });

  };

  return {
    invoke: _invoke,
    
    _validateRequest: _validateRequest,
    _validateRequest_waterfall: _validateRequest_waterfall,
    _listApiResources_waterfall: _listApiResources_waterfall
  }
})();

module.exports = ListApiResources;