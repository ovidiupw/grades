'use strict'; // e.g. use strict scoping via let

const assert = require('assert');
const should = require('should');
const chai = require('chai');

const DB = require('../../../app/config/database');
const Mongoose = require('mongoose');

const User = require('../../../app/entities/user');
const Registration = require('../../../app/entities/registration');
const Course = require('../../../app/entities/course');

const AddNewCourse = require('../../../app/route_handlers/courses/AddCourse');

Mongoose.connect(DB.TEST_DB);

describe('Add New Professor Test', function () {

    /* Test preparation */

    const USER = "1271496582861963@facebook";
    const BAD_USER = "582861963@facebook";

    const API_KEY = "EAAMEC9YE1JIBAItTofZBRVz4uBEyT7hSIhFMwWocBEbCtHsXFs2ZBk" +
        "BPmZAFrdKwoZBQMUw7dSKhxlQkrYcWDrx4TiVAxXcljoG316cPKfuEYCduT0EVjicvoyV" +
        "bKzyoLyFBxbTDPZCBPHa3LLOmdv0x3ZAi5OEiBCQMq1LxwAthds8TJxdzGcxuYMf6NHWKgZD";
    const BAD_API_KEY = "EAAMEC9YE1JIBAItTofZBRVz4uBEyT7hSIhFMwWocBEbCtHsXFs2ZBk" +
        "BPmZAFrdKwoZBQMUw7dSKhxlQkrYcWDrx4TiVAxXcljoG316cPKfuEYCduT0EVjicvoyV" +
        "bKzyoLyFBxbTDPZCBPHa3LLOmdv0x3ZAi5OEiBCQMq1LxwAthds8TJxdzGcxuYMf6NHWKgZ";

    const USER_FACULTY_IDENTITY = "ovidiu.pricop@info.uaic.ro";

    const FACULTY_STATUS = ["developer"];
    const ROLES = ["administrator"];
    const IDENTITY_SECRET = "874703";

    const COURSE_ID = "oop123";
    const TITLE = "oop";
    const YEAR = "1";
    const SEMESTER = "2";

    let userModel = User.model;
    let user = new userModel({
        user: USER,
        facultyIdentity: USER_FACULTY_IDENTITY,
        apiKey: API_KEY,
        keyExpires: "2017-06-03 11:12:34.714Z",
        identityConfirmed: true
    });
    let badUser = new userModel({
        user: BAD_USER,
        facultyIdentity: USER_FACULTY_IDENTITY,
        apiKey: BAD_API_KEY,
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

    let courseModel = Course.model;

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
            courseId: COURSE_ID,
            title: TITLE,
            year: YEAR,
            semester: SEMESTER
        }
    };

    let badReq = {
        body: {
            user: BAD_USER,
            apiKey: BAD_API_KEY,
            courseId: COURSE_ID,
            title: TITLE,
            year: YEAR

        }
    };

    /* Test execution */

    before(function () {
        removeSampleUser(USER);
        removeSampleRegistration(USER_FACULTY_IDENTITY);

        user.save(function (err) {
            if (err) throw err;
        });
        registration.save(function (err) {
            if (err) throw err;
        });
    });

    /*******************************************************/

    it('Should validate the request', function (done) {
        AddNewCourse.validateRequest(req, function (errCallback) {
            if (errCallback) {
                done(errCallback);
            } else {
                done();
            }
        });
    });

    /*******************************************************/

    it('Should fail the validation. permission field should be required', function (done) {
        AddNewCourse.validateRequest(badReq, function (errCallback) {
            if (!errCallback) {
                done(errCallback);
            } else {
                done();
            }
        });
    });

    /*******************************************************/

    it('Should find the user that wants to add a new course', function (done) {
        AddNewCourse.findUser(req, function (errCallback) {
            if (errCallback) {
                done(errCallback);
            } else {
                done();
            }
        });
    });

    /*******************************************************/

    it('Should fail to find the user that wants to add a new course', function (done) {
        AddNewCourse.findUser(badReq, function (errCallback) {
            if (!errCallback) {
                done(errCallback);
            } else {
                done();
            }
        });
    });

    /*******************************************************/

    it('Should validate the apikey', function (done) {
        AddNewCourse.validateApiKey(req, user, function (errCallback) {
            if (errCallback) {
                done(errCallback);
            } else {
                done();
            }
        });
    });

    /*******************************************************/

    it('Should fail to validate the apikey', function (done) {
        AddNewCourse.validateApiKey(badReq, badUser, function (errCallback) {
            if (!errCallback) {
                done(errCallback);
            } else {
                done();
            }
        });
    });

    /*******************************************************/

    it('Should validate the access rights', function (done) {
        AddNewCourse.validateAccessRights(req, user, function (errCallback) {
            if (errCallback) {
                done(errCallback);
            } else {
                done();
            }
        });
    });

    /*******************************************************/

    it('Should fail to validate the access rights.', function (done) {
        AddNewCourse.validateAccessRights(badReq, badUser, function (errCallback) {
            if (!errCallback) {
                done(errCallback);
            } else {
                done();
            }
        });
    });

    /*******************************************************/

    it('Should add the course', function (done) {
        AddNewCourse.addCourse(req, function (errCallback) {
            if (errCallback) {
                done(errCallback);
            } else {
                done();
            }
        });
    });

    /*******************************************************/

    it('Should fail to add the course', function (done) {
        AddNewCourse.addCourse(badReq, function (errCallback) {
            if (!errCallback) {
                done(errCallback);
            } else {
                done();
            }
        });
    });

    /*******************************************************/

    after(function (done) {
        removeSampleUser(USER);
        removeSampleRegistration(USER_FACULTY_IDENTITY);
        removeSampleCourse(COURSE_ID);

        done();
    });

    let removeSampleUser = function (userName) {
        userModel.remove({
            user: userName
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