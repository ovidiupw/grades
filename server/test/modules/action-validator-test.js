'use strict';

const assert = require('assert');
const should = require('should');
const chai = require('chai');
let randomstring = require('randomstring');

let ActionValidator = require('../../app/modules/action-validator');
const RouteNames = require('../../app/constants/routes');
const HttpVerbs = require('../../app/constants/http-verbs');
const PredefinedErrors = require('../../app/modules/predefined-errors');

describe('When validating request actions', function () {
  const SAMPLE_ACTION_1 = {
    verb: HttpVerbs.POST,
    resource: RouteNames.COURSES
  };
  const SAMPLE_ACTION_2 = {
    verb: HttpVerbs.GET,
    resource: RouteNames.MODULES
  };
  let _getSampleActions = function () {
    return [Object.assign({}, SAMPLE_ACTION_1), Object.assign({}, SAMPLE_ACTION_2)];
  };

  it('Successfully validates actions when they are well formed', function (done) {
    let validationResult = ActionValidator.validateRequestActions(_getSampleActions());
    if (validationResult != null)
      return done('Should have validated well formed actions');
    return done();
  });

  it('Returns error when actions is not an array', function (done) {
    const actions = {};
    let validationResult = ActionValidator.validateRequestActions(actions);

    if (validationResult != null) {
      assert.deepEqual(validationResult,
        PredefinedErrors.getInvalidBodyError("Invalid parameter type for 'actions'. Expected an array."));
      return done();
    }
    return done('Should not have validated successfully.');
  });

  it('Returns error when actions is array but it is empty', function (done) {
    const actions = [];
    let validationResult = ActionValidator.validateRequestActions(actions);

    if (validationResult != null) {
      assert.deepEqual(validationResult,
        PredefinedErrors.getInvalidBodyError("Actions array must have at least one element."));
      return done();
    }
    return done('Should not have validated successfully.');
  });

  it('Returns error when actions is well formed but one element is not object', function (done) {
    const actions = _getSampleActions();
    actions.push('');

    let validationResult = ActionValidator.validateRequestActions(actions);

    if (validationResult != null) {
      assert.deepEqual(validationResult,
        PredefinedErrors.getInvalidBodyError("One of the supplied actions had an invalid format. " +
          "Each action must be an object with fields {verb, resource}."));
      return done();
    }
    return done('Should not have validated successfully.');
  });

  it('Returns error when actions contains object with undefined required field', function (done) {
    const actions = _getSampleActions();
    actions.push(Object.assign({}, SAMPLE_ACTION_1, {verb: undefined}));

    let validationResult = ActionValidator.validateRequestActions(actions);

    if (validationResult != null) {
      assert.deepEqual(validationResult,
        PredefinedErrors.getInvalidBodyError("One of the supplied actions had an invalid format. " +
          "Each action must be an object with fields {verb, resource}."));
      return done();
    }
    return done('Should not have validated successfully.');
  });

  it('Returns error when actions contains object with undefined required field', function (done) {
    const actions = _getSampleActions();
    actions.push(Object.assign({}, SAMPLE_ACTION_1, {resource: undefined}));

    let validationResult = ActionValidator.validateRequestActions(actions);

    if (validationResult != null) {
      assert.deepEqual(validationResult,
        PredefinedErrors.getInvalidBodyError("One of the supplied actions had an invalid format. " +
          "Each action must be an object with fields {verb, resource}."));
      return done();
    }
    return done('Should not have validated successfully.');
  });

  it('Returns error when actions contains object with invalid verb', function (done) {
    const actions = _getSampleActions();
    actions.push(Object.assign({}, SAMPLE_ACTION_1, {verb: randomstring.generate({length:6})}));

    let validationResult = ActionValidator.validateRequestActions(actions);

    if (validationResult != null) {
      return done();
    }
    return done('Should not have validated successfully.');
  });

  it('Returns error when actions contains object with invalid resource', function (done) {
    const actions = _getSampleActions();
    actions.push(Object.assign({}, SAMPLE_ACTION_1, {resource: randomstring.generate({length:6})}));

    let validationResult = ActionValidator.validateRequestActions(actions);

    if (validationResult != null) {
      return done();
    }
    return done('Should not have validated successfully.');
  });
});