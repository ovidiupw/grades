'use strict'; // e.g. use strict scoping via let

const assert = require('assert');
const should = require('should');
const chai = require('chai');

const DB = require('../../app/config/database');
const Mongoose = require('mongoose');

const Professor = require('../../app/entities/professor');

Mongoose.connect(DB.TEST_DB);

describe('Professor entity database operations', function () {
  describe('Basic Serialization and Deserialization', function () {

    /* Test preparation */
    const SAMPLE_USER = 'Cosmin Varlan';
    let professorModel = Professor.model;
    let professor = new professorModel({
      user: SAMPLE_USER,
      facultyIdentity: "vcosmin@info.uaic.ro",
      gradDidactic: "profesor",
      courses: [{
        courseId: "100",
        academicGroups: ["A4", "A3", "B6"]
      }]
    });

    let handleRemoveResult = function (err, removeResult) {
      if (err) throw err;
      if (removeResult.result.n !== 0) {
        console.log(`OK. Removed sample professor. Cleanup successful!`);
      }
    };

    /* Test execution */

    before(function () {
      professorModel.remove({
        user: SAMPLE_USER,
        facultyIdentity: "vcosmin@info.uaic.ro",
        gradDidactic: "profesor",
        courses: [{
          courseId: "100",
          academicGroups: ["A4", "A3", "B6"]
        }]
      }, handleRemoveResult);

      professor.save(function (err) {
        if (err) throw err;
      });
    });

    /*******************************************************/

    it('Finds the professor in the database', function (done) {
      professorModel.findOne({
        user: SAMPLE_USER
      }, function (err, foundProfessor) {
        if (err) throw err;
        assert.equal(foundProfessor.user, SAMPLE_USER);
        done();
      });
    });

    /*******************************************************/

    it('Should require at least the user field on insertion', function (done) {
      /* Test for both null and undefined */

      professor.user = undefined;
      professor.save(function (err) {
        if (!err) {
          should.fail('User should be required. Check the schema!');
        }
      });

      professor.user = null;
      professor.save(function (err) {
        if (!err) {
          should.fail('User should be required. Check the schema!');
        }
      });

      done();
    });

    /*******************************************************/

    it('Should insert a new record in the databse, just like a login', function (done) {
      /* Test for both null and undefined */

      professor = new professorModel({
        user: SAMPLE_USER,
        facultyIdentity: "vcosmin@info.uaic.ro",
        gradDidactic: "profesor",
        courses: [{
          courseId: "100",
          academicGroups: ["A4", "A3", "B6"]
        }]
      });

      professor.save(function (err) {
        if (err) {
          should.fail('Save to database failed!');
        }
      });

      done();
    });

    /*******************************************************/

    after(function (done) {
      professorModel.remove({
        user: SAMPLE_USER
      }, handleRemoveResult);

      done();
    });
  });
});
