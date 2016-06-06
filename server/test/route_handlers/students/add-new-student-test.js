'use strict'; // e.g. use strict scoping via let

const assert = require('assert');
const should = require('should');
const chai = require('chai');

const DB = require('../../../app/config/database');
const Mongoose = require('mongoose');

const User = require('../../../app/entities/user');
const Registration = require('../../../app/entities/registration');
const Student = require('../../../app/entities/student');

const AddNewStudent = require('../../../app/route_handlers/students/AddNewStudent');

Mongoose.connect(DB.TEST_DB);

describe('Add New Student Test', function () {

  /* Test preparation */

  const USER = "1271496582861963@facebook";

  const API_KEY = "EAAMEC9YE1JIBAItTofZBRVz4uBEyT7hSIhFMwWocBEbCtHsXFs2ZBk" +
    "BPmZAFrdKwoZBQMUw7dSKhxlQkrYcWDrx4TiVAxXcljoG316cPKfuEYCduT0EVjicvoyV" +
    "bKzyoLyFBxbTDPZCBPHa3LLOmdv0x3ZAi5OEiBCQMq1LxwAthds8TJxdzGcxuYMf6NHWKgZD";

  const USER_FACULTY_IDENTITY = "ovidiu.pricop@info.uaic.ro";

  const FACULTY_STATUS = ["developer"];
  const ROLES = ["administrator"];
  const IDENTITY_SECRET = "874703";

  const FACULTY_IDENTITY = "nicolae.butnaru@info.uaic.ro";
  const REGISTRATION_NUMBER = "123456789";
  const BIRTH_DATE = "1995-02-02";
  const ACADEMIC_YEAR = "2";
  const ACADEMIC_GROUP = "A4";

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

  let studentModel = Student.model;

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
      facultyIdentity: FACULTY_IDENTITY,
      registrationNumber: REGISTRATION_NUMBER,
      birthDate: BIRTH_DATE,
      academicYear: ACADEMIC_YEAR,
      academicGroup: ACADEMIC_GROUP
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
    AddNewStudent.validateRequest(req, function (errCallback) {
      if (errCallback) {
        done(errCallback);
      } else {
        done();
      }
    });
  });

  /*******************************************************/

  it('Should find the user that wants to add a new student', function (done) {
    AddNewStudent.findUser(req, function (errCallback) {
      if (errCallback) {
        done(errCallback);
      } else {
        done();
      }
    });
  });

  /*******************************************************/

  it('Should validate the apikey', function (done) {
    AddNewStudent.validateApiKey(req, user, function (errCallback) {
      if (errCallback) {
        done(errCallback);
      } else {
        done();
      }
    });
  });

  /*******************************************************/

  it('Should validate the access rights', function (done) {
    AddNewStudent.validateAccessRights(req, user, function (errCallback) {
      if (errCallback) {
        done(errCallback);
      } else {
        done();
      }
    });
  });

  /*******************************************************/

  it('Should add the student', function (done) {
    AddNewStudent.addStudent(req, function (errCallback) {
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
    removeSampleStudent(FACULTY_IDENTITY);

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
  let removeSampleStudent = function (fid) {
    studentModel.remove({
      facultyIdentity: fid
    }, handleRemoveResult);
  };

});