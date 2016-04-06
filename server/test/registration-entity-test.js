'use strict'; // e.g. use strict scoping via let

const assert = require('assert');
const should = require('should');
const chai = require('chai');

const DB = require('../app/config/database');
const Mongoose = require('mongoose');

const Registration = require('../app/entities/registration');

Mongoose.connect(DB.TEST_DB);

describe('Registration entity serialization and deserialization', function() {
  const SAMPLE_IDENTITY = "a.b@c.d";
  const SAMPLE_IDENTITY_2 = "asdkj@.cd.c";

  let registration = new Registration.model({
    facultyIdentity: SAMPLE_IDENTITY
  });

  let handleRemoveResult = function(err, removeResult) {
    if (err) throw err;
    if (removeResult.result.n !== 0) {
      console.log(`OK. Removed sample identity. Cleanup successful!`);
    }
  };

  /* Test execution */

  before(function() {
    Registration.model.remove({
      facultyIdentity: SAMPLE_IDENTITY
    }, handleRemoveResult);

    registration.save(function(err) {
      if (err) throw err;
    });
  });

  /*******************************************************/

  it('Finds the registration via identity in the database', function(done) {
    Registration.model.findOne({
      facultyIdentity: SAMPLE_IDENTITY
    }, function(err, foundRegistration) {
      if (err) throw err;
      assert.equal(foundRegistration.facultyIdentity, SAMPLE_IDENTITY);
      done();
    });
  });

  /*******************************************************/

  it('Should require at least the faculty identity field on insertion', function(done) {
    /* Test for both null and undefined */

    registration.facultyIdentity = undefined;
    registration.save(function(err) {
      if (!err) {
        should.fail('Faculty identity should be required. Check the schema!');
      }
    });

    registration.facultyIdentity = null;
    registration.save(function(err) {
      if (!err) {
        should.fail('User is should be required. Check the schema!');
      }
    });

    done();
  });

  /*******************************************************/

  it('Should serialize and deserialze a full registration', function(done) {
    let registration = new Registration.model({
      facultyIdentity: SAMPLE_IDENTITY_2,
      roles: ["decan", "secretar"],
      identitySecret: ["28374612"]
    });

    registration.save(function(err) {
      if (err) should.fail('Failed when saving sample_identity_2 in the database.');
    });

    Registration.model.findOne({ facultyIdentity: SAMPLE_IDENTITY_2 },
      function(err, foundRegistration) {
        if (err) should.fail('Failed when finding sample_identity_2 in the database.');
        if (!foundRegistration) {
          should.fail('Should have found a registration in the database');
        }

        assert.deepEqual(registration.facultyIdentity, foundRegistration.facultyIdentity);
        assert.deepEqual(registration.roles, foundRegistration.roles);
        assert.deepEqual(registration.identitySecret, foundRegistration.identitySecret);

        done();
      }
    );
  });


  /*******************************************************/

  after(function() {
    Registration.model.remove({
      facultyIdentity: SAMPLE_IDENTITY
    }, handleRemoveResult);
    Registration.model.remove({
      facultyIdentity: SAMPLE_IDENTITY_2
    }, handleRemoveResult);
  });



});
