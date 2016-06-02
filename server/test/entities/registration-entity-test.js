'use strict'; // e.g. use strict scoping via let

const assert = require('assert');
const should = require('should');
const chai = require('chai');

const DB = require('../../app/config/database');
const Mongoose = require('mongoose');

const Registration = require('../../app/entities/registration');
const RegistrationClasses = require('../../app/constants/registration-classes');

Mongoose.connect(DB.TEST_DB);

describe('Registration entity serialization and deserialization', function () {
  const SAMPLE_IDENTITY = "a.b@c.d";
  const SAMPLE_IDENTITY_2 = "asdkj@.cd.c";

  let registration = new Registration.model({
    facultyIdentity: SAMPLE_IDENTITY,
    facultyStatus: [RegistrationClasses.ADMINISTRATOR]
  });

  let handleRemoveResult = function (err, removeResult) {
    if (err) throw err;
    if (removeResult.result.n !== 0) {
      console.log(`OK. Removed sample identity. Cleanup successful!`);
    }
  };

  /* Test execution */

  before(function () {
    Registration.model.remove({
      facultyIdentity: SAMPLE_IDENTITY
    }, handleRemoveResult);

    registration.save(function (err) {
      if (err) throw err;
    });
  });

  /*******************************************************/

  it('Throws error when invalid facultyStatus specified on save', function (done) {
    let invalidRegistration = new Registration.model({
      facultyIdentity: "Test_Identity@testIdentity.testIdentity",
      facultyStatus: ['ahmedakmahid-48941589761523']
    });

    invalidRegistration.save(function (err) {
      if (err) {
        console.log(err);
        done();
      } else {
        done('Error! Should have failed inserting invalid faculty status');
      }
    });
  });

  /*******************************************************/

  it('Generates a random numeric string correctly in the database', function (done) {
    registration.generateIdentitySecret(
      function (err) {
        if (err) {
          done(err);
        }
      },
      function () { /* success ignored */
      }
    );

    Registration.model.findByUser(
      registration.facultyIdentity,
      function (foundRegistration) {
        if (foundRegistration) {
          assert(foundRegistration.identitySecret != null);
          done();
        } else {
          done("Registration not found");
        }

      },
      function (err) {
        done(err);
      }
    );
  });

  /*******************************************************/

  it('Should require at least the faculty identity field on insertion', function (done) {
    /* Test for both null and undefined */

    registration.facultyIdentity = undefined;
    registration.save(function (err) {
      if (!err) {
        should.fail('Faculty identity should be required. Check the schema!');
      }
    });

    registration.facultyIdentity = null;
    registration.save(function (err) {
      if (!err) {
        should.fail('User is should be required. Check the schema!');
      }
    });

    done();
  });

  /*******************************************************/

  it('Should serialize and deserialze a full registration', function (done) {
    let registration = new Registration.model({
      facultyIdentity: SAMPLE_IDENTITY_2,
      facultyStatus: [RegistrationClasses.ADMINISTRATOR],
      roles: ["decan", "secretar"],
      identitySecret: ["28374612"]
    });

    registration.save(function (err) {
      if (err) should.fail('Failed when saving sample_identity_2 in the database.');
    });

    Registration.model.findOne({facultyIdentity: SAMPLE_IDENTITY_2},
      function (err, foundRegistration) {
        if (err) should.fail('Failed when finding sample_identity_2 in the database.');
        if (!foundRegistration) {
          should.fail('Should have found a registration in the database');
        }

        assert.deepEqual(registration.facultyIdentity, foundRegistration.facultyIdentity);
        assert.deepEqual(registration.facultyStatus, foundRegistration.facultyStatus);
        assert.deepEqual(registration.roles, foundRegistration.roles);
        assert.deepEqual(registration.identitySecret, foundRegistration.identitySecret);

        done();
      }
    );
  });

  /*******************************************************/

  it('Finds a registration based on facultyIdentity using findByUser', function (done) {
    Registration.model.findByUser(
      SAMPLE_IDENTITY,
      function (foundRegistration) {
        done();
      },
      function (err) {
        done(err);
      }
    );
  });

  /*******************************************************/

  after(function (done) {
    Registration.model.remove({
      facultyIdentity: SAMPLE_IDENTITY
    }, handleRemoveResult);

    Registration.model.remove({
      facultyIdentity: SAMPLE_IDENTITY_2
    }, handleRemoveResult);

    done();
  });


});
