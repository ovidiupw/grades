'use strict'; // e.g. use strict scoping via let

const assert = require('assert');
const should = require('should');
const chai = require('chai');

const DB = require('../../app/config/database');
const Mongoose = require('mongoose');

const Professor = require('../../app/entities/professor');

Mongoose.connect(DB.TEST_DB);

describe('Basic Serialization and Deserialization', function () {

  /* Test preparation */

  const FACULTY_IDENTITY = "prenume.nume@info.uaic.ro";
  const DIDACTIC_GRADE = "profesor";
  const COURSES = [{
    courseId: "1",
    academicGroups: ["A4", "A3"]
  }];

  let professorModel = Professor.model;
  let professor = new professorModel({
    facultyIdentity: FACULTY_IDENTITY,
    didacticGrade: DIDACTIC_GRADE,
    courses: COURSES
  });

  let handleRemoveResult = function (err, removeResult) {
    if (err) throw err;
    if (removeResult.result.n !== 0) {
      console.log(`OK. Removed sample professor. Cleanup successful!`);
    }
  };

  /* Test execution */

  before(function () {
    removeSampleProfessor(FACULTY_IDENTITY);

    professor.save(function (err) {
      if (err) throw err;
    });
  });


  /*******************************************************/

  it('Finds the professor in the database', function (done) {
    professorModel.findOne({
      facultyIdentity: FACULTY_IDENTITY
    }, function (err, foundProfessor) {
      if (err) throw err;
      assert.equal(foundProfessor.facultyIdentity, FACULTY_IDENTITY);
      done();
    });
  });


  /*******************************************************/

  it('Should require at least the facultyIdentity field on insertion', function (done) {
    /* Test for both null and undefined */

    professor.facultyIdentity = undefined;
    professor.save(function (err) {
      if (!err) {
        done(err);
      }
    });

    professor.facultyIdentity = null;
    professor.save(function (err) {
      if (!err) {
        done(err);
      }
    });

    done();
  });



  it('Should not validate a facultyIdentity under minimum length.', function (done) {

    professor = new professorModel({
      facultyIdentity: 'ba' /* Should fail when trying to save */
    });

    professor.save(function (err) {
      if (!err) {
        done(err);
      }
    });

    done();
  });



  after(function (done) {
    removeSampleProfessor(FACULTY_IDENTITY);

    done();
  });

  let removeSampleProfessor = function (facultyIdentity) {
    professorModel.remove({
      facultyIdentity: facultyIdentity
    }, handleRemoveResult);
  };

});