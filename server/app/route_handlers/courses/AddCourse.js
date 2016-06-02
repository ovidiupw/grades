/**
 * Created by dryflo on 5/28/2016.
 */
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
 * Use invoke() method of this closure to remove (DELETE) a
 * course from the database.
 *
 * @type {{invoke}}
 */
let DeleteCourse = (function () {

    let _validateRequest = function (req, errCallback) {

        process.nextTick(() => {
            if (!RequestValidator.bodyIsValid(req.body)) {
                return errCallback(PredefinedErrors.getInvalidBodyError());
            }
            if (!RequestValidator.requestContainsAuthenticationData(req)) {
                return errCallback(PredefinedErrors.getAuthorizationDataNotFoundError());
            }
            if (req.body.courseId == undefined) {
                return errCallback(new Error(
                    Errors.REQ_BODY_INVALID.id,
                    Errors.REQ_BODY_INVALID.message,
                    "Required parameters not supplied. Please add " +
                    "'courseId' to your request."
                ));
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
                    user, RouteNames.COURSES, HttpVerbs.DELETE,
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
                let courseModel = new Course.model();

                courseModel.findOneAndRemove({
                    courseId: req.body.courseId
                }, function (courseRemovedErr) {
                    if(courseRemovedErr){
                        callback(PredefinedErrors.getDatabaseOperationFailedError(courseRemovedErr));
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

module.exports = DeleteCourse;