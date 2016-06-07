'use strict';

let async = require('async');
let RequestValidator = require('../../modules/request-validator');

const RouteNames = require('../../constants/routes');
const HttpVerbs = require('../../constants/http-verbs');
const Json2CsvStream = require('json2csv-stream');

let User = require('../../entities/user');
let Student = require('../../entities/student');

let PredefinedErrors = require('../../modules/predefined-errors');

const FILE_NAME = 'StudentExport.csv';
const LIMIT = 250000;

let ExportStudentsCsv = (function () {

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

    let _findUser = function (req,res,callback) {
        User.model.findByUser(req.headers['user'],
            function (foundUser) {
                return callback(null, req,res, foundUser);
            },
            function (error) {
                return callback(PredefinedErrors.getDatabaseOperationFailedError(error));
            }
        );
    };

    let _validateApiKey = function (req,res, foundUser, callback) {
        RequestValidator.validateApiKey(foundUser, req.headers['apikey'], function (apiKeyExpired) {
            if (apiKeyExpired) {
                return callback(apiKeyExpired);
            } else {
                return callback(null, req, res,foundUser);
            }
        });
    };

    let _validateAccessRights = function (req,res, user, callback) {
        RequestValidator.validateAccessRights(
            user, RouteNames.STUDENTS_CSV, HttpVerbs.GET,
            function (error) {
                if (error) {
                    /* In case user does not have permissions to access this resource */
                    return callback(error);
                } else {
                    return callback(null,req,res);
                }
            });
    };

    let _streamToClient = function(req,res,callback){
        var studentsFromDatabase = Student.model.find({},function (studentsListErr,result) {
            if(studentsListErr){
                return callback(PredefinedErrors.getDatabaseOperationFailedError(studentsListErr));
            }
        }).select('-_id -__v');
        if (LIMIT){
            studentsFromDatabase.limit(LIMIT);
        }
        var headers = {
            'Content-Type': 'text/csv',
            'Content-disposition': 'attachment;filename=' + FILE_NAME
        }
        res.writeHead(200, headers);

        var databaseStream = studentsFromDatabase.stream({transform: JSON.stringify});
        var parser = new Json2CsvStream();

        var stream = databaseStream.pipe(parser).pipe(res);
        stream.on('finish',function () {
            return callback(null);
        });
    };

    let _invoke = function (req, res) {
        async.waterfall([
            function (callback) {
                _validateRequest(req, function (invalidRequest) {
                    if (invalidRequest) {
                        return callback(invalidRequest);
                    } else {
                        return callback(null,req,res);
                    }
                });
            },

            _findUser,
            _validateApiKey,
            _validateAccessRights,
            _streamToClient,

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
        invoke: _invoke
    }
})();

module.exports = ExportStudentsCsv;