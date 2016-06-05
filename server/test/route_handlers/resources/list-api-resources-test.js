'use strict';

const assert = require('assert');
const should = require('should');
const chai = require('chai');

const ListApiResources = require('../../../app/route_handlers/resources/ListApiResources');
const RouteNames = require('../../../app/constants/routes');

describe('When trying to list api resources', function () {

  const SAMPLE_USER = 'abc@example.com';
  const SAMPLE_API_KEY = '1234';

  let _getValidRequestObject = function() {
    return {
      headers: {
        user: SAMPLE_USER,
        apikey: SAMPLE_API_KEY
      }
    }
  };
  
  it('Validates the request successfully when request is valid', function(done) {
    const request = _getValidRequestObject();
    ListApiResources._validateRequest(request, function(error) {
      if (error) return done(new Error(JSON.stringify(error)));
      return done();
    });
  });

  it('Throws error when request does not contain headers', function(done) {
    const request = _getValidRequestObject();
    request.headers = undefined;
    ListApiResources._validateRequest(request, function(error) {
      if (error) return done();
      return done(new Error('Request contained headers when not expecting that.'));
    });
  });

  it('Throws error when request does not contain headers', function(done) {
    const request = _getValidRequestObject();
    request.headers.user = undefined;
    ListApiResources._validateRequest(request, function(error) {
      if (error) return done();
      return done(new Error('Request validated although user was missing from headers.'));
    });
  });

  it('Throws error when request does not contain headers', function(done) {
    const request = _getValidRequestObject();
    request.headers.apikey = undefined;
    ListApiResources._validateRequest(request, function(error) {
      if (error) return done();
      return done(new Error('Request validated although apiKey was missing from headers.'));
    });
  });

  it('Validates waterfall request successfully', function(done) {
    ListApiResources._setReceivedRequest(_getValidRequestObject());
    ListApiResources._validateRequest_waterfall(function(error) {
      if (error) return done(new Error(error));
      return done();
    });
  });

  it('Successfully lists api resources', function(done) {
    ListApiResources._setReceivedRequest(_getValidRequestObject());
    ListApiResources._listApiResources_waterfall({}, function(error, apiResources) {
      if (error) return done(new Error(error));

      let expectedResources = [];
      for (let routeName in RouteNames) {
        if (RouteNames.hasOwnProperty(routeName)) {
          expectedResources.push(RouteNames[routeName]);
        }
      }

      assert.deepEqual(apiResources, expectedResources);
      done();
    });
  });
});