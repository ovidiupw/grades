'use strict';

let User = require('../entities/user');
let PredefinedErrors = require('../modules/predefined-errors');
let RequestValidator = require('../modules/request-validator');

let AuthorizationHelper = (function() {
  
  let _userApiKey;
  let _setRequestUserAndApiKey = function(reqUserAndApiKeyObject) {
    if (!reqUserAndApiKeyObject.hasOwnProperty('user')
      || !reqUserAndApiKeyObject.hasOwnProperty('apiKey'))
      throw new Error("user and apiKey must be set!");
    
    _userApiKey = reqUserAndApiKeyObject;
  };

  let _resourceAndVerb;
  let _setCurrentResourceAndVerb = function(resourceObject) {
    if (!resourceObject.hasOwnProperty('resource')
      || !resourceObject.hasOwnProperty('verb'))
      throw new Error("resource and verb must be set!");

    _resourceAndVerb = resourceObject;
  };
  
  let _assertRequestProperlyDefined = function() {
    if (_userApiKey == undefined || _resourceAndVerb == undefined)
      throw 'Request (user and apiKey) and (resource and verb) must be set prior to using this function';
  };

  let _authorizationFunctionNumber = 0;
  let _totalNumberOfFunctions = 3;
  let _ignoreFunctionCallOrder = true;

  let _setIgnoreFunctionCallOrder = function() {
    _ignoreFunctionCallOrder = true;
  };

  let _setConsiderFunctionCallOrder = function() {
    _ignoreFunctionCallOrder = false;
  };

  let _assertFunctionIsCalledInOrder = function(shouldBeNumber) {
    if (_ignoreFunctionCallOrder) return;
    
    ++_authorizationFunctionNumber;
    if (_authorizationFunctionNumber !== shouldBeNumber) {
      throw new Error('Function call order was not well formed. Please call findUser, validateApiKey and' +
        ' validateAccessRights in this order.');
    }
    _authorizationFunctionNumber = _authorizationFunctionNumber % _totalNumberOfFunctions;
  };

  let _findUserInDatabase = function (user, callback) {
    _assertRequestProperlyDefined();
    _assertFunctionIsCalledInOrder(1);
    
    User.model.findByUser(user,
      function (foundUser) {
        return callback(null, foundUser);
      },
      function (userFindError) {
        _authorizationFunctionNumber = 0;
        return callback(PredefinedErrors.getDatabaseOperationFailedError(userFindError));
      }
    );
  };

  let _validateUserApiKey = function (foundUser, callback) {
    _assertRequestProperlyDefined();
    _assertFunctionIsCalledInOrder(2);
    
    RequestValidator.validateApiKey(foundUser, _userApiKey.apiKey, function (apiKeyExpired) {
      if (apiKeyExpired) {
        _authorizationFunctionNumber = 0;
        return callback(apiKeyExpired);
      } else {
        return callback(null, foundUser);
      }
    });
  };

  let _validateAccessRights = function(foundUser, callback) {
    _assertRequestProperlyDefined();
    _assertFunctionIsCalledInOrder(3);

    RequestValidator.validateAccessRights(foundUser, _resourceAndVerb.resource, _resourceAndVerb.verb,
      function (error) {
        if (error) {
          /* In case user does not have permissions to access this resource */
          _authorizationFunctionNumber = 0;
          return callback(error);
        } else {
          return callback(null, foundUser);
        }
      });
  };
  
  return {
    setUserAndApiKey: _setRequestUserAndApiKey,
    setCurrentResourceAndVerb: _setCurrentResourceAndVerb,
    findUserInDatabase: _findUserInDatabase,
    validateUserApiKey: _validateUserApiKey,
    validateAccessRights: _validateAccessRights,
    setIgnoreFunctionCallOrder: _setIgnoreFunctionCallOrder,
    setConsiderFunctionCallOrder: _setConsiderFunctionCallOrder
  };
})();

module.exports = AuthorizationHelper;