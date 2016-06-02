'use strict'; // e.g. use strict scoping via let

const assert = require('assert');
const should = require('should');
const chai = require('chai');

const DB = require('../../app/config/database');
const Mongoose = require('mongoose');

const Student = require('../../app/entities/student');

Mongoose.connect(DB.TEST_DB);

describe('Basic Serialization and Deserialization', function () {

  /* Test preparation */

  const DATE_OF_BIRTH = new Date("2012-12-12");
  const FACULTY_IDENTITY = "prenume.nume@info.uaic.ro";
  const REGISTRATION_NUMBER = "1234567890";
  const ACADEMIC_YEAR = "2";
  const ACADEMIC_GROUP = "A4";

  let studentModel = Student.model;
  let student = new studentModel({
    facultyIdentity: FACULTY_IDENTITY,
    registrationNumber: REGISTRATION_NUMBER,
    birthDate: DATE_OF_BIRTH,
    academicYear: ACADEMIC_YEAR,
    academicGroup: ACADEMIC_GROUP
  });

  let handleRemoveResult = function (err, removeResult) {
    if (err) throw err;
    if (removeResult.result.n !== 0) {
      console.log(`OK. Removed sample student. Cleanup successful!`);
    }
  };

  /* Test execution */

  before(function () {
    removeSampleStudent(FACULTY_IDENTITY);

    student.save(function (err) {
      if (err) throw err;
    });
  });

  /*******************************************************/

  it('Finds the student in the database', function (done) {
    studentModel.findOne({
      facultyIdentity: FACULTY_IDENTITY
    }, function (err, foundStudent) {
      if (err) throw err;
      assert.equal(foundStudent.facultyIdentity, FACULTY_IDENTITY);
      done();
    });
  });

  /*******************************************************/

  it('Should require at least the facultyIdentity field on insertion', function (done) {
    /* Test for both null and undefined */

    student.facultyIdentity = undefined;
    student.save(function (err) {
      if (!err) {
        done(err);
      }
    });

    student.facultyIdentity = null;
    student.save(function (err) {
      if (!err) {
        done(err);
      }
    });

    done();
  });

  /*******************************************************/

  it('Should not validate a facultyIdentity under minimum length.', function (done) {

    student = new studentModel({
      facultyIdentity: 'ba' /* Should fail when trying to save */
    });

    student.save(function (err) {
      if (!err) {
        done(err);
      }
    });

    done();
  });

  /*******************************************************/

  after(function (done) {
    removeSampleStudent(FACULTY_IDENTITY);

    done();
  });

  let removeSampleStudent = function (facultyIdentity) {
    studentModel.remove({
      facultyIdentity: facultyIdentity
    }, handleRemoveResult);
  };

});
