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
 * Use invoke() method of this closure to add (POST) a new
 * professor in the database.
 *
 * @type {{invoke}}
 */
let AddNewProfessor = (function () {

    let _validateRequest = function (req, errCallback) {

        process.nextTick(() => {
            if (!RequestValidator.bodyIsValid(req.body)) {
                return errCallback(PredefinedErrors.getInvalidBodyError());
            }
            if (!RequestValidator.requestContainsAuthenticationData(req)) {
                return errCallback(PredefinedErrors.getAuthorizationDataNotFoundError());
            }
            if (req.body.facultyIdentity == undefined || 
                req.body.didacticGrade == undefined ||
                req.body.courses == undefined) {
                return errCallback(new Error(
                    Errors.REQ_BODY_INVALID.id,
                    Errors.REQ_BODY_INVALID.message,
                    "Required parameters not supplied. Please add " +
                    " 'faculty identity', 'didacticGrade', 'courses' to your request."
                ));
            }
            let coursesArray;
            try {
                coursesArray = JSON.parse(req.body.courses);
            } catch (ignored) {
            }

            if (!util.isArray(coursesArray)) {
                return errCallback(new Error(
                    Errors.REQ_BODY_INVALID.id,
                    Errors.REQ_BODY_INVALID.message,
                    "Invalid parameter type for 'courses'. Expected an array."
                ));
            }
            for (let course in coursesArray) {
                if (!util.isObject(course) || course.courseId == undefined || !util.isArray(course.academicGroups)) {

                    return errCallback(new Error(
                        Errors.REQ_BODY_INVALID.id,
                        Errors.REQ_BODY_INVALID.message,
                        "One of the supplied actions had an invalid format. " +
                        "Each course must be an object with fields {courseId, academicGroup:array}."
                    ));
                }
            }
            return errCallback(null);
        });
    };

    let _invoke = function (req, res) {
        async.waterfall([
            
            function (callback) {
                _validateRequest(req, function (invalidRequest) {
                    if (invalidRequest) {
                        return callback(invalidRequest);
                    } else {
                        return callback(null);
                    }
                });
            },

            function (callback) {
                User.model.findByUser(req.body.user,
                    function (foundUser) {
                        return callback(null, foundUser);
                    },
                    function (userFindError) {
                        return callback(userFindError);
                    }
                );
            },

            /* In case of success, the user has been found. */
            function (foundUser, callback) {
                RequestValidator.validateApiKey(foundUser, req.body.apiKey, function (apiKeyExpired) {
                    if (apiKeyExpired) {
                        return callback(apiKeyExpired);
                    } else {
                        return callback(null, foundUser);
                    }
                });
            },

            function (user, callback) {
                RequestValidator.validateAccessRights(
                    user, RouteNames.PROFESSORS, HttpVerbs.POST,
                    function (error) {
                        if (error) {
                            /* In case user does not have permissions to access this resource */
                            return callback(error);
                        } else {
                            return callback(null);
                        }
                    });
            },

            function (callback) {
                let newProfessor = new Professor.model({
                    facultyIdentity: req.body.facultyIdentity,
                    didacticGrade: req.body.didacticGrade,
                    courses: req.body.courses
                });

                newProfessor.save(
                    function (professorSavedErr) {
                        if(professorSavedErr){
                            callback(PredefinedErrors.getDatabaseOperationFailedError(professorSavedErr));
                        }else{
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
    };

    return {
        invoke: _invoke
    }
})();

module.exports = AddNewProfessor;