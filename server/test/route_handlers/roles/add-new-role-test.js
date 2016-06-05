'use strict';

const assert = require('assert');
const should = require('should');
const chai = require('chai');
let randomstring = require('randomstring');

let Role = require('../../../app/entities/role');
const AddNewRole = require('../../../app/route_handlers/roles/AddNewRole');
const RouteNames = require('../../../app/constants/routes');
const HttpVerbs = require('../../../app/constants/http-verbs');


const DB = require('../../../app/config/database');
const Mongoose = require('mongoose');
Mongoose.connect(DB.TEST_DB);

describe('When trying to add a new role', function () {

  const SAMPLE_USER = 'abc@example.com';
  const SAMPLE_API_KEY = '1234';
  const SAMPLE_TITLE = 'test_role' + randomstring.generate({length: 6});
  const SAMPLE_ACTION = {
    verb: HttpVerbs.POST,
    resource: RouteNames.COURSES
  };

  let _getValidRequestObject = function () {
    return {
      body: {
        user: SAMPLE_USER,
        apiKey: SAMPLE_API_KEY,
        title: SAMPLE_TITLE,
        actions: [SAMPLE_ACTION]
      }
    }
  };

  it('Validates the request successfully when request is valid', function(done) {
    const request = _getValidRequestObject();
    AddNewRole._validateRequest(request, function(error) {
      if (error) return done(new Error(JSON.stringify(error)));
      return done();
    });
  });

  it('Throws error when request does not contain body', function(done) {
    const request = _getValidRequestObject();
    request.body = undefined;
    AddNewRole._validateRequest(request, function(error) {
      if (error) return done();
      return done('Should not have validated request');
    });
  });

  it('Throws error when request body does not contain user auth data', function(done) {
    const request = _getValidRequestObject();
    request.body.user = undefined;
    AddNewRole._validateRequest(request, function(error) {
      if (error) return done();
      return done('Should not have validated request');
    });
  });

  it('Throws error when request body does not contain apiKey auth data', function(done) {
    const request = _getValidRequestObject();
    request.body.apiKey = undefined;
    AddNewRole._validateRequest(request, function(error) {
      if (error) return done();
      return done('Should not have validated request');
    });
  });

  it('Throws error when request body does not contain title payload', function(done) {
    const request = _getValidRequestObject();
    request.body.title = undefined;
    AddNewRole._validateRequest(request, function(error) {
      if (error) return done();
      return done('Should not have validated request');
    });
  });

  it('Throws error when request body does not contain actions payload', function(done) {
    const request = _getValidRequestObject();
    request.body.actions = undefined;
    AddNewRole._validateRequest(request, function(error) {
      if (error) return done();
      return done('Should not have validated request');
    });
  });

  it('Saves the role in the database', function(done) {
    const request = _getValidRequestObject();
    AddNewRole._setReceivedRequest(request);

    AddNewRole._saveRole_waterfall(request, function(error) {
      if (error) return done(new Error(error));

      Role.model.remove({
        title: SAMPLE_TITLE
      }, function(err, removeResult) {
        if (err) return done(new Error(err));
        if (removeResult.result.n === 0) return done(new Error('Should have found and deleted sample role.'));
        return done();
      });
    });
  });

});