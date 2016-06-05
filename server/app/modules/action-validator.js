'use strict';

let PredefinedErrors = require('./predefined-errors');
let RouteNames = require('../constants/routes');
let HttpVerbs = require('../constants/http-verbs');
let Utility = require('./utility');
let util = require('util');

let ActionValidator = (function() {

  let _validateRequestActions = function (actions) {

    if (!util.isArray(actions)) {
      return PredefinedErrors.getInvalidBodyError("Invalid parameter type for 'actions'. Expected an array.");
    }

    if (actions.length < 1) {
      return PredefinedErrors.getInvalidBodyError("Actions array must have at least one element.");
    }

    for (let actionIndex in actions) {
      if (!util.isObject(actions[actionIndex])
        || actions[actionIndex].verb == undefined
        || actions[actionIndex].resource == undefined) {

        return PredefinedErrors.getInvalidBodyError("One of the supplied actions had an invalid format. " +
          "Each action must be an object with fields {verb, resource}.");
      }

      if (!_isActionObjectValid(actions[actionIndex])) {
        return PredefinedErrors.getInvalidBodyError("Invalid action object specified: "
          + JSON.stringify(actions[actionIndex]));
      }
    }

    return null;
  };

  let _isActionObjectValid = function(actionObject) {
    if (Object.keys(actionObject).length !== 2) return false;
    if (!_objectContainsValidHttpVerb(actionObject)) return false;
    if (!_objectContainsValidHttpRoute(actionObject)) return false;

    return true;
  };

  let _objectContainsValidHttpVerb = function(actionObject) {
    for (let httpVerb in HttpVerbs) {
      if (HttpVerbs.hasOwnProperty(httpVerb)) {
        if (actionObject[Utility.PATH.VERB] === httpVerb) return true;
      }
    }
    return false;
  };

  let _objectContainsValidHttpRoute = function(actionObject) {
    for (let routeName in RouteNames) {
      if (RouteNames.hasOwnProperty(routeName)) {
        if (actionObject[Utility.PATH.RESOURCE] === RouteNames[routeName]) return true;
      }
    }
    return false;
  };

  return {
    validateRequestActions: _validateRequestActions
  }
})();

module.exports = ActionValidator;