'use strict'; // e.g. use strict scoping via let

const assert = require('assert');
const should = require('should');
const chai = require('chai');

const DB = require('../app/config/database');
const Mongoose = require('mongoose');

const User = require('../app/entities/user');

Mongoose.connect(DB.TEST_DB);

describe('User entity database operations', function() {
  describe('Basic Serialization and Deserialization', function() {

    /* Test preparation */

    const SAMPLE_USER = 'ahmedkamakoulkjashdj286731jbhnbjksd';
    let userModel = User.model;
    let user = new userModel({
      user: SAMPLE_USER
    });

    let handleRemoveResult = function(err, removeResult) {
      if (err) throw err;
      if (removeResult.result.n !== 0) {
        console.log(`OK. Removed sample user. Cleanup successful!`);
      }
    };

    /* Test execution */

    before(function() {
      userModel.remove({
        user: SAMPLE_USER
      }, handleRemoveResult);

      user.save(function(err) {
        if (err) throw err;
      });
    });

    /*******************************************************/

    it('Finds the user in the database', function(done) {
      userModel.findOne({
        user: SAMPLE_USER
      }, function(err, foundUser) {
        if (err) throw err;
        assert.equal(foundUser.user, SAMPLE_USER);
        done();
      });
    });

    /*******************************************************/

    it('Should require at least the user field on insertion', function(done) {
      /* Test for both null and undefined */

      user.user = undefined;
      user.save(function(err) {
        if (!err) {
          should.fail('User should be required. Check the schema!');
        }
      });

      user.user = null;
      user.save(function(err) {
        if (!err) {
          should.fail('User should be required. Check the schema!');
        }
      });

      done();
    });

    /*******************************************************/

    it('Should insert a new record in the databse, just like a login', function(done) {
      /* Test for both null and undefined */
      let apiKeyExpiration = new Date();
      apiKeyExpiration.setHours(apiKeyExpiration.getHours() + 1);
      const userIdentity = "123213@facebook";

      user = new userModel({
        user: userIdentity,
        apiKey: "12345",
        keyExpires: apiKeyExpiration,
        identityConfirmed: false
      });

      user.save(function(err) {
        if (err) {
          should.fail('Save to database failed!');
        }
      });

      done();
    });

    /*******************************************************/

    after(function() {
      userModel.remove({
        user: SAMPLE_USER
      }, handleRemoveResult);

      userModel.remove({
        user: "123213@facebook"
      }, handleRemoveResult);
    });
  });
});
