'use strict';

const assert = require('assert');
const should = require('should');
const chai = require('chai');

let AuthorizationHelper = require('../../app/modules/authorization');
let User = require('../../app/entities/user');
let Registration = require('../../app/entities/registration');
let randomstring = require('randomstring');

const DB = require('../../app/config/database');
const Mongoose = require('mongoose');
Mongoose.connect(DB.TEST_DB);

describe('When trying to list api resources', function () {

  const SAMPLE_USER = 'abc@example.com@ahmedabdoulah';
  const SAMPLE_API_KEY = randomstring.generate({length: 128});
  let SAMPLE_EXPIRATION_DATE = new Date();
  SAMPLE_EXPIRATION_DATE = SAMPLE_EXPIRATION_DATE.setHours(SAMPLE_EXPIRATION_DATE.getHours() + 1);
  const SAMPLE_FACULTY_IDENTITY = 'ovidiu.pricop@info.uaic.ro';
  const SAMPLE_FACULTY_STATUS = ["developer"];
  const SAMPLE_ROLES = ["administrator"];

  let sampleRegistration = new Registration.model({
    facultyIdentity: SAMPLE_FACULTY_IDENTITY,
    facultyStatus: SAMPLE_FACULTY_STATUS,
    roles: SAMPLE_ROLES
  });

  let sampleUserObject = new User.model({
    user: SAMPLE_USER,
    apiKey: SAMPLE_API_KEY,
    keyExpires: SAMPLE_EXPIRATION_DATE,
    identityConfirmed: true,
    facultyIdentity: SAMPLE_FACULTY_IDENTITY
  });
  let databaseUser;

  before(function () {
    User.model.remove({
      user: SAMPLE_USER
    }, function (err, removeResult) {
      if (err) throw err;
    });

    sampleUserObject.save(function (err) {
      if (err) throw err;
    });

    User.model.findByUser(SAMPLE_USER,
    function(foundUser) {
      databaseUser = foundUser;
    },
    function(errorFindingUser) {
      throw new Error(errorFindingUser);
    });

    Registration.model.remove({
      facultyIdentity: SAMPLE_FACULTY_IDENTITY
    }, function (err, removeResult) {
      if (err) throw err;
    });

    sampleRegistration.save(function (err) {
      if (err) throw err;
    });

    AuthorizationHelper.setUserAndApiKey({
      user: SAMPLE_USER,
      apiKey: SAMPLE_API_KEY
    });
    AuthorizationHelper.setCurrentResourceAndVerb({
      resource: 'res',
      verb: 'POST'
    });
    AuthorizationHelper.setIgnoreFunctionCallOrder();
  });

  it('Finds the user in the database and calls the callback accordingly.', function (done) {
    AuthorizationHelper.findUserInDatabase(SAMPLE_USER, function (error, foundUser) {
      if (error) return done(new Error(JSON.stringify(error)));
      assert.equal(foundUser.user, sampleUserObject.user);
      done();
    })
  });

  it('Doesnt find the user in database if user is non-existent.', function (done) {
    AuthorizationHelper.findUserInDatabase(SAMPLE_USER + "ibsbajgd97127865410hsghj#^!&#",
      function (error, foundUser) {
        if (error) return done();
        done(new Error('Should not have found the user in the database. Double check the correctness.'));
      })
  });

  it('Validates user api key successfully if apiKey is valid.', function (done) {
    AuthorizationHelper.validateUserApiKey(databaseUser, function(error, foundUser) {
      if (error) return done(new Error(JSON.stringify(error)));
      assert.equal(databaseUser, foundUser);
      return done();
    });
  });

  it('Validates user access rights based on user roles and gives permission.', function (done) {
    AuthorizationHelper.validateAccessRights(databaseUser, function(error) {
      if (error) return done(new Error(JSON.stringify(error)));
      return done();
    });
  });

  it('Requires functions to be called in order when function call in order is set to true', function(done) {
    AuthorizationHelper.setConsiderFunctionCallOrder();
    AuthorizationHelper.findUserInDatabase(SAMPLE_USER);
    AuthorizationHelper.validateUserApiKey(databaseUser);
    AuthorizationHelper.validateAccessRights(databaseUser);
    AuthorizationHelper.findUserInDatabase(SAMPLE_USER);
    AuthorizationHelper.validateUserApiKey(databaseUser);
    AuthorizationHelper.validateAccessRights(databaseUser);
    AuthorizationHelper.setIgnoreFunctionCallOrder();
    done();
  });

  it('Fails when authorization functions in AuthorizationHelper are not called in order', function(done) {
    try {
      AuthorizationHelper.setConsiderFunctionCallOrder();
      AuthorizationHelper.findUserInDatabase(SAMPLE_USER);
      AuthorizationHelper.validateAccessRights(databaseUser);
      done(new Error('Should have failed when functions were called in non-standard order.'));
    } catch(ignored) {
      AuthorizationHelper.setIgnoreFunctionCallOrder();
      done();
    }
  });

});