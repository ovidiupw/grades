/**
 * Created by dryflo on 5/18/2016.
 */
'use strict';

let async = require('async');
let RequestValidator = require('../../modules/request-validator');

const RouteNames = require('../../constants/routes');
const HttpVerbs = require('../../constants/http-verbs');

let User = require('../../entities/user');
let Professor = require('../../entities/professor');

let PredefinedErrors = require('../../modules/predefined-errors');
/**
 * Use invoke() method of this closure to GET a list
 * of professors currently in the database.
 *
 * @type {{invoke}}
 */
let ListProfessors = (function () {

    let _invoke = function (req, res) {
        async.waterfall([
            function (callback) {
                Professor.model.find({}, function(getProfessorsError, professors) {
                    if(getProfessorsError){
                        callback(PredefinedErrors.getDatabaseOperationFailedError(getProfessorsError));
                    }else{
                        callback(null,professors)
                    }
                });


            },
            function (professors,callback) {
                /* If it reaches this, the request succeeded. */
                res.status(200);
                res.send(professors);
            }
        ], function (error, results) {
            if (error) {
                res.status(400);
                res.send(error);
            }
        });
    };

    return {
        invoke: _invoke
    }
})();

module.exports = ListProfessors;