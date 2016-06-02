/**
 * Created by dryflo on 5/18/2016.
 */
'use strict';

let async = require('async');
let RequestValidator = require('../../modules/request-validator');
let util = require('util');

const RouteNames = require('../../constants/routes');
const HttpVerbs = require('../../constants/http-verbs');

let PredefinedErrors = require('../../modules/predefined-errors');
let Errors = require('../../constants/errors');
let Error = require('../../modules/error');

let User = require('../../entities/user');
let Professor = require('../../entities/professor');

/**
 * Use invoke() method of this closure to remove (DELETE) a
 * professor from the database.
 *
 * @type {{invoke}}
 */
let DeleteProfessor = (function () {

    let _validateRequest = function (req, errCallback) {

        process.nextTick(() => {
            if (!RequestValidator.bodyIsValid(req.body)) {
                return errCallback(PredefinedErrors.getInvalidBodyError());
            }
            if (!RequestValidator.requestContainsAuthenticationData(req)) {
                return errCallback(PredefinedErrors.getAuthorizationDataNotFoundError());
            }
            if (req.body.facultyIdentity == undefined) {
                return errCallback(new Error(
                    Errors.REQ_BODY_INVALID.id,
                    Errors.REQ_BODY_INVALID.message,
                    "Required parameters not supplied. Please add " +
                    "'faculty identity' to your request."
                ));
            }

            return errCallback(null);
        });
    };

    let _findUser = function (req,callback) {
        User.model.findByUser(req.body.user,
            function (foundUser) {
                return callback(null,req,foundUser);
            },
            function (userFindError) {
                return callback(userFindError);
            }
        );
    };

    let _validateApiKey = function (req,foundUser, callback) {
        RequestValidator.validateApiKey(foundUser, req.body.apiKey, function (apiKeyExpired) {
            if (apiKeyExpired) {
                return callback(apiKeyExpired);
            } else {
                return callback(null, req, foundUser);
            }
        });
    };

    let _validateAccessRights = function (req,user, callback) {
        RequestValidator.validateAccessRights(
            user, RouteNames.PROFESSORS, HttpVerbs.DELETE,
            function (error) {
                if (error) {
                    /* In case user does not have permissions to access this resource */
                    return callback(error);
                } else {
                    return callback(null,req);
                }
            });
    };

    let _deleteProfessor = function (req,callback) {
        Professor.model.findOneAndRemove({
            facultyIdentity: req.body.facultyIdentity
        },  function (professorRemoveErr) {
            if(professorRemoveErr){
                callback(PredefinedErrors.getDatabaseOperationFailedError(professorRemoveErr));
            }else{
                callback(null);
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
                        return callback(null,req);
                    }
                });
            },

            _findUser,

            /* In case of success, the user has been found. */
            _validateApiKey,

            _validateAccessRights,

            _deleteProfessor,

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
    };

    return {
        invoke: _invoke,
        findUser: _findUser,
        validateApiKey: _validateApiKey,
        validateAccessRights: _validateAccessRights,
        deleteProfessor: _deleteProfessor
    }
})();

module.exports = DeleteProfessor;