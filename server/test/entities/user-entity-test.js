'use strict'; // e.g. use strict scoping via let

const assert = require('assert');
const should = require('should');
const chai = require('chai');

const DB = require('../../app/config/database');
const Mongoose = require('mongoose');

const User = require('../../app/entities/user');

Mongoose.connect(DB.TEST_DB);

describe('Basic Serialization and Deserialization', function () {

  /* Test preparation */

  const SAMPLE_USER = 'ahmedkamakoulkjashdj286731jbhnbjksd';
  const SAMPLE_USER_2 = '123456@facebook';

  let userModel = User.model;
  let user = new userModel({
    user: SAMPLE_USER
  });

  let handleRemoveResult = function (err, removeResult) {
    if (err) throw err;
    if (removeResult.result.n !== 0) {
      console.log(`OK. Removed sample user. Cleanup successful!`);
    }
  };

  /* Test execution */

  before(function () {
    removeSampleUser(SAMPLE_USER);
    removeSampleUser(SAMPLE_USER_2);

    user.save(function (err) {
      if (err) throw err;
    });
  });

  /*******************************************************/

  it('Finds the user in the database', function (done) {
    userModel.findOne({
      user: SAMPLE_USER
    }, function (err, foundUser) {
      if (err) throw err;
      assert.equal(foundUser.user, SAMPLE_USER);
      done();
    });
  });

  /*******************************************************/

  it('Should require at least the user field on insertion', function (done) {
    /* Test for both null and undefined */

    user.user = undefined;
    user.save(function (err) {
      if (!err) {
        done(err);
      }
    });

    user.user = null;
    user.save(function (err) {
      if (!err) {
        done(err);
      }
    });

    done();
  });

  /*******************************************************/

  it('Should insert a new record in the databse, just like a login', function (done) {
    /* Test for both null and undefined */
    let apiKeyExpiration = new Date();
    apiKeyExpiration.setHours(apiKeyExpiration.getHours() + 1);

    user = new userModel({
      user: SAMPLE_USER_2,
      keyExpires: apiKeyExpiration,
      identityConfirmed: false
    });

    user.save(function (err) {
      if (err) {
        done(err);
      }
    });

    done();
  });

  /*******************************************************/

  it('Should not validate a facultyIdentity under minimum length.', function (done) {

    user = new userModel({
      user: 'abc',
      facultyIdentity: 'ba' /* Should fail when trying to save */
    });

    user.save(function (err) {
      if (!err) {
        done(err);
      }
    });

    done();
  });

  /*******************************************************/

  after(function (done) {
    removeSampleUser(SAMPLE_USER);
    removeSampleUser(SAMPLE_USER_2);

    done();
  });

  let removeSampleUser = function (userName) {
    userModel.remove({
      user: userName
    }, handleRemoveResult);
  };

});

