'use strict';

let async = require('async');
let RequestValidator = require('../../modules/request-validator');

const RouteNames = require('../../constants/routes');
const HttpVerbs = require('../../constants/http-verbs');
const jsonExport = require('jsonexport');

let User = require('../../entities/user');
let Professor = require('../../entities/professor');

let PredefinedErrors = require('../../modules/predefined-errors');

const FILE_NAME = 'ProfessorsExport.csv';
const headers = {
    'Content-Type': 'text/csv',
    'Content-disposition': 'attachment;filename=' + FILE_NAME
}

let ExportProfessorsCsv = (function () {

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
            user, RouteNames.PROFESSORS_CSV, HttpVerbs.GET,
            function (error) {
                if (error) {
                    /* In case user does not have permissions to access this resource */
                    return callback(error);
                } else {
                    return callback(null, req, res);
                }
            });
    };

    let _streamToClient = function (req, res, callback) {

        var professorsFromDatabase = Professor.model.find({}, function (professorsListErr, result) {
            if (professorsListErr) {
                return callback(PredefinedErrors.getDatabaseOperationFailedError(professorsListErr));
            }
            jsonExport(result, function (err, csv) {
                if (err) return callback(err);
                return callback(null, csv);
            });
        }).lean().select('-_id -__v -courses._id');

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
            _streamToClient,

            function (result, callback) {
                /* If it reaches this, the request succeeded. */
                res.status(200);
                res.writeHead(headers);
                res.end(result);
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
        streamToClient: _streamToClient
    }
})();

module.exports = ExportProfessorsCsv;