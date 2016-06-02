/**
 * Created by dryflo on 5/29/2016.
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
let Course = require('../../entities/course');

/**
 * Use invoke() method of this closure to add (POST) a
 * course in the database.
 *
 * @type {{invoke}}
 */
let AddNewCourse = (function () {

    let _validateRequest = function (req, errCallback) {

        process.nextTick(() => {
            if (!RequestValidator.bodyIsValid(req.body)) {
                return errCallback(PredefinedErrors.getInvalidBodyError());
            }
            if (!RequestValidator.requestContainsAuthenticationData(req)) {
                return errCallback(PredefinedErrors.getAuthorizationDataNotFoundError());
            }
            if (req.body.courseId == undefined ||
                req.body.title == undefined ||
                req.body.year == undefined ||
                req.body.semester == undefined) {
                return errCallback(new Error(
                    Errors.REQ_BODY_INVALID.id,
                    Errors.REQ_BODY_INVALID.message,
                    "Required parameters not supplied. Please add " +
                    "'courseId' , 'title' , 'year' , 'semester' to your request."
                ));
            }

            return errCallback(null);
        });
    };

    let _findUser = function (req, callback) {
        User.model.findByUser(req.body.user,
            function (foundUser) {
                return callback(null, req, foundUser);
            },
            function (userFindError) {
                return callback(userFindError);
            }
        );
    };

    let _validateApiKey = function (req, foundUser, callback) {
        RequestValidator.validateApiKey(foundUser, req.body.apiKey, function (apiKeyExpired) {
            if (apiKeyExpired) {
                return callback(apiKeyExpired);
            } else {
                return callback(null, req, foundUser);
            }
        });
    };

    let _validateAccessRights = function (req, foundUser, callback) {
        RequestValidator.validateAccessRights(
            foundUser, RouteNames.COURSES, HttpVerbs.POST,
            function (error) {
                if (error) {
                    /* In case user does not have permissions to access this resource */
                    return callback(error);
                } else {
                    return callback(null,req);
                }
            });
    };

    let _addCourse = function (req,callback) {
        let courseModel = new Course.model({
            courseId: req.body.courseId,
            title: req.body.title,
            year: req.body.year,
            semester: req.body.semester,
            evaluation: "undefined"
        });

        courseModel.save(
            function (courseAddErr) {
                if (courseAddErr) {
                    callback(PredefinedErrors.getDatabaseOperationFailedError(courseAddErr));
                } else {
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
                        return callback(null, req);
                    }
                });
            },

            _findUser,

            /* In case of success, the user has been found. */
            _validateApiKey,

            _validateAccessRights,

            _addCourse,
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
        addCourse: _addCourse
    }
})();

module.exports = AddNewCourse;