'use strict'; // e.g. use strict scoping via let

const assert = require('assert');
const should = require('should');
const chai = require('chai');

const DB = require('../../../app/config/database');
const Mongoose = require('mongoose');

const User = require('../../../app/entities/user');
const Registration = require('../../../app/entities/registration');
const Module = require('../../../app/entities/module');
const Course = require('../../../app/entities/course');

const DeleteModule = require('../../../app/route_handlers/modules/DeleteModule');

Mongoose.connect(DB.TEST_DB);

describe('Delete Module Test', function () {

    /* Test preparation */

    const USER = "1271496582861963@facebook";

    const API_KEY = "EAAMEC9YE1JIBAItTofZBRVz4uBEyT7hSIhFMwWocBEbCtHsXFs2ZBk" +
        "BPmZAFrdKwoZBQMUw7dSKhxlQkrYcWDrx4TiVAxXcljoG316cPKfuEYCduT0EVjicvoyV" +
        "bKzyoLyFBxbTDPZCBPHa3LLOmdv0x3ZAi5OEiBCQMq1LxwAthds8TJxdzGcxuYMf6NHWKgZD";

    const USER_FACULTY_IDENTITY = "ovidiu.pricop@info.uaic.ro";

    const FACULTY_STATUS = ["developer"];
    const ROLES = ["administrator"];
    const IDENTITY_SECRET = "874703";

    const MODULE_ID = "FAI_NOTA_SEMINAR";
    const TITLE = "Nota seminar FAI";
    const COURSE_ID = "FAI_13";
    const CREATED_BY = "prenume.nume@info.uaic.ro";
    const MIN_TO_PROMOTE = "5";
    const FORMULA = "(FAI_NOTA_ACTIVITATE + FAI_NOTA_TEST_1 + FAI_NOTA_TEST_2) / 3";
    const MIN = "0";
    const MAX = "10";

    const COURSE_COURSE_ID = "FAI_13";
    const COURSE_MODULES = [
        {
            moduleId: "FAI_NOTA_ACTIVITATE"
        },
        {
            moduleId: "FAI_NOTA_TEST_1"
        },
        {
            moduleId: "FAI_NOTA_TEST_2"
        },
        {
            moduleId: "FAI_NOTA_SEMINAR"
        },
        {
            moduleId: "FAI_NOTA_CURS"
        }];

    const COURSE_TITLE = "Fundamente algebrice ale informaticii";
    const COURSE_YEAR = "1";
    const COURSE_SEMESTER = "2";
    const COURSE_EVALUATION = "(FAI_NOTA_CURS/2 + FAI_NOTA_SEMINAR/2) > 5";

    let courseModel = Course.model;
    let course = new courseModel({
        courseId: COURSE_COURSE_ID,
        modules: COURSE_MODULES,
        title: COURSE_TITLE,
        year: COURSE_YEAR,
        semester: COURSE_SEMESTER,
        evaluation: COURSE_EVALUATION
    });

    let userModel = User.model;
    let user = new userModel({
        user: USER,
        facultyIdentity: USER_FACULTY_IDENTITY,
        apiKey: API_KEY,
        keyExpires: "2017-06-03 11:12:34.714Z",
        identityConfirmed: true
    });

    let registrationModel = Registration.model;
    let registration = new registrationModel({
        facultyIdentity: USER_FACULTY_IDENTITY,
        facultyStatus: FACULTY_STATUS,
        roles: ROLES,
        identitySecret: IDENTITY_SECRET
    });

    let moduleModel = Module.model;
    let module = new moduleModel({
        moduleId: MODULE_ID,
        title: TITLE,
        courseId: COURSE_ID,
        createdBy: CREATED_BY,
        minToPromote: MIN_TO_PROMOTE,
        formula: FORMULA,
        min: MIN,
        max: MAX
    });

    let handleRemoveResult = function (err, removeResult) {
        if (err) throw err;
        if (removeResult.result.n !== 0) {
            console.log(`OK. Removed sample user. Cleanup successful!`);
        }
    };

    let req = {
        body: {
            user: USER,
            apiKey: API_KEY,
            moduleId: MODULE_ID,
            courseId: COURSE_ID
        }
    };

    /* Test execution */

    before(function () {
        removeSampleUser(USER);
        removeSampleRegistration(USER_FACULTY_IDENTITY);
        removeSampleModule(MODULE_ID);
        removeSampleCourse(COURSE_ID);

        user.save(function (err) {
            if (err) throw err;
        });
        registration.save(function (err) {
            if (err) throw err;
        });
        module.save(function (err) {
            if (err) throw err;
        });
        course.save(function (err) {
            if (err) throw err;
        });
    });

    /*******************************************************/

    it('Should validate the request', function (done) {
        DeleteModule.validateRequest(req, function (errCallback) {
            if (errCallback) {
                done(errCallback);
            } else {
                done();
            }
        });
    });

    /*******************************************************/

    it('Should validate the apikey', function (done) {
        DeleteModule.validateApiKey(req, user, function (errCallback) {
            if (errCallback) {
                done(errCallback);
            } else {
                done();
            }
        });
    });

    /*******************************************************/

    it('Should validate the access rights', function (done) {
        DeleteModule.validateAccessRights(req, user, function (errCallback) {
            if (errCallback) {
                done(errCallback);
            } else {
                done();
            }
        });
    });

    /*******************************************************/

    it('Should delete the module', function (done) {
        DeleteModule.deleteModule(req, function (errCallback) {
            if (errCallback) {
                done(errCallback);
            } else {
                done();
            }
        });
    });

    /*******************************************************/

    it('Should update the modules array from courses collection. If evaluation field is equal to moduleId it will set to undefined', function (done) {
        var oldModulesList = course.modules;

        DeleteModule.updateModuleInCourses(req, function (errCallback) {
            if (errCallback) {
                done(errCallback);
            } else {
                Course.model.findOne({courseId: COURSE_COURSE_ID}, function (err, foundCourse) {
                    if (oldModulesList.length == foundCourse.modules.length ||
                        oldModulesList[oldModulesList.length - 1].moduleId == foundCourse.modules[foundCourse.modules.length - 1].moduleId ||
                        foundCourse.modules[foundCourse.modules.length - 1].moduleId == MODULE_ID) {
                        done("failed to update modules list");
                    }
                });
                done();
            }
            ;

        });
    });

    /*******************************************************/

    after(function (done) {
        removeSampleUser(USER);
        removeSampleRegistration(USER_FACULTY_IDENTITY);


        done();
    });

    let removeSampleUser = function (userName) {
        userModel.remove({
            user: userName
        }, handleRemoveResult);
    };
    let removeSampleModule = function (mid) {
        moduleModel.remove({
            moduleId: mid
        }, handleRemoveResult);
    };
    let removeSampleRegistration = function (fid) {
        registrationModel.remove({
            facultyIdentity: fid
        }, handleRemoveResult);
    };
    let removeSampleCourse = function (cid) {
        courseModel.remove({
            courseId: cid
        }, handleRemoveResult);
    };

});