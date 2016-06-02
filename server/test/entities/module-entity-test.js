'use strict'; // e.g. use strict scoping via let

const assert = require('assert');
const should = require('should');
const chai = require('chai');

const DB = require('../../app/config/database');
const Mongoose = require('mongoose');

const Module = require('../../app/entities/module');

Mongoose.connect(DB.TEST_DB);

describe('Basic Serialization and Deserialization', function () {

  /* Test preparation */

  const SAMPLE_MODULE_ID = 'module@1111';

  let moduleModel = Module.model;
  let module = new moduleModel({
    moduleId: SAMPLE_MODULE_ID
  });

  let handleRemoveResult = function (err, removeResult) {
    if (err) throw err;
    if (removeResult.result.n !== 0) {
      console.log(`OK. Removed sample module. Cleanup successful!`);
    }
  };

  /* Test execution */

  before(function () {
    removeSampleModule(SAMPLE_MODULE_ID);

    module.save(function (err) {
      if (err) throw err;
    });
  });

  /*******************************************************/

  it('Finds the module in the database', function (done) {
    moduleModel.findOne({
      moduleId: SAMPLE_MODULE_ID
    }, function (err, foundModule) {
      if (err) throw err;
      assert.equal(foundModule.moduleId, SAMPLE_MODULE_ID);
      done();
    });
  });

  /*******************************************************/

  it('Should require at least the moduleId field on insertion', function (done) {
    /* Test for both null and undefined */

    module.moduleId = undefined;
    module.save(function (err) {
      if (!err) {
        done(err);
      }
    });

    module.moduleId = null;
    module.save(function (err) {
      if (!err) {
        done(err);
      }
    });

    done();
  });

  /*******************************************************/

  it('Should not validate a facultyIdentity value in the createdBy field under minimum length.', function (done) {

    module = new moduleModel({
      moduleId: 'abc',
      createdBy: 'ba' /* Should fail when trying to save */
    });

    module.save(function (err) {
      if (!err) {
        done(err);
      }
    });

    done();
  });

  /*******************************************************/

  after(function (done) {
    removeSampleModule(SAMPLE_MODULE_ID);

    done();
  });

  let removeSampleModule = function (moduleId) {
    moduleModel.remove({
      moduleId: moduleId
    }, handleRemoveResult);
  };

});