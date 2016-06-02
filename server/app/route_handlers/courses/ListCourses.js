/**
 * Created by dryflo on 5/29/2016.
 */
'use strict';

let async = require('async');
let RequestValidator = require('../../modules/request-validator');

let PredefinedErrors = require('../../modules/predefined-errors');

const RouteNames = require('../../constants/routes');
const HttpVerbs = require('../../constants/http-verbs');

let User = require('../../entities/user');
let Course = require('../../entities/course');

/**
 * Use invoke() method of this closure to list (GET) 
 * courses from the database.
 *
 * @type {{invoke}}
 */
let ListCourses = (function () {

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

    let _findUser = function (req, callback) {
        User.model.findByUser(req.headers['user'],
            function (foundUser) {
                return callback(null, req, foundUser);
            },
            function (error) {
                return callback(PredefinedErrors.getDatabaseOperationFailedError(error));
            }
        );
    };

    let _validateApiKey = function (req, foundUser, callback) {
        RequestValidator.validateApiKey(foundUser, req.headers['apikey'], function (apiKeyExpired) {
            if (apiKeyExpired) {
                return callback(apiKeyExpired);
            } else {
                return callback(null, foundUser);
            }
        });
    };

    let _validateAccessRights = function (user, callback) {
        RequestValidator.validateAccessRights(
            user, RouteNames.COURSES, HttpVerbs.GET,
            function (error) {
                if (error) {
                    /* In case user does not have permissions to access this resource */
                    return callback(error);
                } else {
                    return callback(null);
                }
            });
    };

    let _listCourses = function (callback) {
        Course.model.find({}, function(getCoursesErr, courses) {
            if(getCoursesErr){
                callback(PredefinedErrors.getDatabaseOperationFailedError(getCoursesErr));
            }else{
                callback(null,courses)
            }
        });
    };
    let _invoke = function (req, res) {
        async.waterfall([

            function (callback) {
                _validateRequest(req, function (invalidRequestError) {
                    if (invalidRequestError) {
                        return callback(invalidRequestError);
                    } else {
                        return callback(null, req);
                    }
                });
            },

            _findUser,
            _validateApiKey,
            _validateAccessRights,
            _listCourses,
            
            function (courses,callback) {
                /* If it reaches this, the request succeeded. */
                res.status(200);
                res.send(courses);
            }
        ], function (error, results) {
            if (error) {
                res.status(400);
                res.send(error);
            }
        });
    };

    return {
        invoke: _invoke,
        findUser: _findUser,
        validateApiKey: _validateApiKey,
        validateAccessRights: _validateAccessRights,
        listCourses: _listCourses
    }
})();

module.exports = ListCourses;