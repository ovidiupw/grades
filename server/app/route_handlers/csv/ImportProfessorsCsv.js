'use strict';

let async = require('async');
let RequestValidator = require('../../modules/request-validator');

const RouteNames = require('../../constants/routes');
const HttpVerbs = require('../../constants/http-verbs');
const csvToJson = require('csvtojson').Converter;
const fs = require('fs');

let User = require('../../entities/user');
let Professor = require('../../entities/professor');

let PredefinedErrors = require('../../modules/predefined-errors');
let Errors = require('../../constants/errors');

let ImportProfessorsCsv = (function () {

  let _validateRequest = function (req, errCallback) {

    process.nextTick(() => {
      if (!RequestValidator.headerIsValid(req.headers)) {
        return errCallback(PredefinedErrors.getInvalidHeaderError());
      }
      if (!RequestValidator.requestHeaderContainsAuthenticationData(req)) {
        return errCallback(PredefinedErrors.getAuthorizationDataNotFoundError());
      }

      if (req.body.professorImportFileContent == undefined) {
        return errCallback(new Error(
          Errors.REQ_BODY_INVALID.id,
          Errors.REQ_BODY_INVALID.message,
          "Required parameters not supplied. Please add " +
          " 'studentsExportFileContent' "
        ));
      }
      return errCallback(null);
    });
  };

  let _findUser = function (req, res, callback) {
    User.model.findByUser(req.headers['user'],
      function (foundUser) {
        return callback(null, req, res, foundUser);
      },
      function (error) {
        return callback(PredefinedErrors.getDatabaseOperationFailedError(error));
      }
    );
  };

  let _validateApiKey = function (req, res, foundUser, callback) {
    RequestValidator.validateApiKey(foundUser, req.headers['apikey'], function (apiKeyExpired) {
      if (apiKeyExpired) {
        return callback(apiKeyExpired);
      } else {
        return callback(null, req, res, foundUser);
      }
    });
  };

  let _validateAccessRights = function (req, res, user, callback) {
    RequestValidator.validateAccessRights(
      user, RouteNames.PROFESSORS_CSV, HttpVerbs.POST,
      function (error) {
        if (error) {
          /* In case user does not have permissions to access this resource */
          return callback(error);
        } else {
          return callback(null, req, res);
        }
      });
  };

  let _saveProfessorToDatabase = function (req, res, callback) {

    var converter = new csvToJson({});
    var convertedFromJsonToText = "";

    for (var registration of req.body.professorImportFileContent) {
      convertedFromJsonToText += registration + "\n";
    }

    converter.fromString(convertedFromJsonToText, function (err, professors) {
      if (err) {
        return callback(PredefinedErrors.getInvalidBodyError(
          "The supplied csv file is not valid "));
      } else {

        _saveProfessor(0, professors, callback);
      }
    });

  };

  let _saveProfessor = function (currentProfessor, professors, callback) {
    if (currentProfessor == professors.length) {
      return callback(null);
    }
    let professorModel = new Professor.model(({
      facultyIdentity: professors[currentProfessor].facultyIdentity,
      didacticGrade: professors[currentProfessor].didacticGrade,
      courses: professors[currentProfessor].courses
    }));
    professorModel.save(function (err) {
      if (err)  return callback(PredefinedErrors.getDatabaseOperationFailedError(err));
      else {
        _saveProfessor(currentProfessor + 1, professors, callback);
      }
    });

  };

  let _invoke = function (req, res) {
    async.waterfall([
      function (callback) {
        _validateRequest(req, function (invalidRequest) {
          if (invalidRequest) {
            return callback(invalidRequest);
          } else {
            return callback(null, req, res);
          }
        });
      },

      _findUser,
      _validateApiKey,
      _validateAccessRights,
      _saveProfessorToDatabase,

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
  return {
    invoke: _invoke,
    findUser: _findUser,
    validateApiKey: _validateApiKey,
    validateAccessRights: _validateAccessRights,
    saveProfessorToDatabase: _saveProfessorToDatabase,
    saveProfessor: _saveProfessor
  }
})();

module.exports = ImportProfessorsCsv;