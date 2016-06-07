'use strict'; // e.g. use strict scoping via let

const assert = require('assert');
const should = require('should');
const chai = require('chai');

const DB = require('../../../app/config/database');
const Mongoose = require('mongoose');

const User = require('../../../app/entities/user');
const Registration = require('../../../app/entities/registration');

const ListCourses = require('../../../app/route_handlers/courses/ListCourses');

Mongoose.connect(DB.TEST_DB);

describe('List courses Test', function () {

    /* Test preparation */

    const USER = "1271496582861963@facebook";
    const BAD_USER = "1276582861963@facebook";

    const API_KEY = "EAAMEC9YE1JIBAItTofZBRVz4uBEyT7hSIhFMwWocBEbCtHsXFs2ZBk" +
        "BPmZAFrdKwoZBQMUw7dSKhxlQkrYcWDrx4TiVAxXcljoG316cPKfuEYCduT0EVjicvoyV" +
        "bKzyoLyFBxbTDPZCBPHa3LLOmdv0x3ZAi5OEiBCQMq1LxwAthds8TJxdzGcxuYMf6NHWKgZD";

    const USER_FACULTY_IDENTITY = "ovidiu.pricop@info.uaic.ro";

    const FACULTY_STATUS = ["developer"];
    const ROLES = ["administrator"];
    const IDENTITY_SECRET = "874703";

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

    let handleRemoveResult = function (err, removeResult) {
        if (err) throw err;
        if (removeResult.result.n !== 0) {
            console.log(`OK. Removed sample user. Cleanup successful!`);
        }
    };

    let req = {
        headers: {
            user: USER,
            apikey: API_KEY
        }
    };
    let badReq = {
        headers: {
            user: BAD_USER
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
        ListCourses.validateRequest(req, function (errCallback) {
            if (errCallback) {
                done(errCallback);
            } else {
                done();
            }
        });
    });

    /*******************************************************/

    it('Should fail to validate the request, apiKey should be required', function (done) {
        ListCourses.validateRequest(badReq, function (errCallback) {
            if (!errCallback) {
                done(errCallback);
            } else {
                done();
            }
        });
    });

    /*******************************************************/

    it('Should find the user that wants to list the courses', function (done) {
        ListCourses.findUser(req, function (errCallback) {
            if (errCallback) {
                done(errCallback);
            } else {
                done();
            }
        });
    });

    /*******************************************************/

    it('Should fail to find the user that wants to list the courses', function (done) {
        ListCourses.findUser(badReq, function (errCallback) {
            if (!errCallback) {
                done(errCallback);
            } else {
                done();
            }
        });
    });

    /*******************************************************/

    it('Should validate the apikey', function (done) {
        ListCourses.validateApiKey(req, user, function (errCallback) {
            if (errCallback) {
                done(errCallback);
            } else {
                done();
            }
        });
    });

    /*******************************************************/

    it('Should validate the apikey', function (done) {
        ListCourses.validateApiKey(badReq, badUser, function (errCallback) {
            if (!errCallback) {
                done(errCallback);
            } else {
                done();
            }
        });
    });

    /*******************************************************/

    it('Should validate the access rights', function (done) {
        ListCourses.validateAccessRights(user, function (errCallback) {
            if (errCallback) {
                done(errCallback);
            } else {
                done();
            }
        });
    });

    /*******************************************************/

    it('Should fail to validate the access rights', function (done) {
        ListCourses.validateAccessRights(badUser, function (errCallback) {
            if (!errCallback) {
                done(errCallback);
            } else {
                done();
            }
        });
    });

    /*******************************************************/

    it('Should list the courses', function (done) {
        ListCourses.listCourses( function (errCallback) {
            if (errCallback) {
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

});