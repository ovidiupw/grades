'use strict'; // e.g. use strict scoping via let

const assert = require('assert');
const should = require('should');
const chai = require('chai');

const DB = require('../../app/config/database');
const Mongoose = require('mongoose');

const Student = require('../../app/entities/student');

Mongoose.connect(DB.TEST_DB);

describe('Student entity database operations', function () {
  describe('Basic Serialization and Deserialization', function () {

    /* Test preparation */
    const dateOfBirth = new Date("2012-12-12");
    const SAMPLE_USER = 'CiucTiberiuConstantin';
    let studentModel = Student.model;
    let student = new studentModel({
      user: SAMPLE_USER,
      facultyIdentity: "cocojambo@info.uaic.ro",
      registrationNumber: "y99toesrdyorsdfyto7edtfy6rtfyur6fygu8",
      birthDate: dateOfBirth,
      academicYear: "2",
      academicGroup: "A4"
    });

    let handleRemoveResult = function (err, removeResult) {
      if (err) throw err;
      if (removeResult.result.n !== 0) {
        console.log(`OK. Removed sample student. Cleanup successful!`);
      }
    };

    /* Test execution */

    before(function () {
      studentModel.remove({
        user: SAMPLE_USER,
        facultyIdentity: "cocojambo@info.uaic.ro",
        registrationNumber: "y99toesrdyorsdfyto7edtfy6rtfyur6fygu8",
        birthDate: dateOfBirth,
        academicYear: "2",
        academicGroup: "A4"

      }, handleRemoveResult);

      student.save(function (err) {
        if (err) throw err;
      });
    });

    /*******************************************************/

    it('Finds the student in the database', function (done) {
      studentModel.findOne({
        user: SAMPLE_USER
      }, function (err, foundStudent) {
        if (err) throw err;
        assert.equal(foundStudent.user, SAMPLE_USER);
        done();
      });
    });

    /*******************************************************/

    it('Should require at least the user field on insertion', function (done) {
      /* Test for both null and undefined */

      student.user = undefined;
      student.save(function (err) {
        if (!err) {
          should.fail('User should be required. Check the schema!');
        }
      });

      student.user = null;
      student.save(function (err) {
        if (!err) {
          should.fail('User should be required. Check the schema!');
        }
      });

      done();
    });

    /*******************************************************/

    it('Should insert a new record in the databse, just like a login', function (done) {
      /* Test for both null and undefined */
      let apiKeyExpiration = new Date();
      apiKeyExpiration.setHours(apiKeyExpiration.getHours() + 1);

      student = new studentModel({
        user: SAMPLE_USER,
        facultyIdentity: "cocojambo@info.uaic.ro",
        registrationNumber: "y99toesrdyorsdfyto7edtfy6rtfyur6fygu8",
        birthDate: dateOfBirth,
        academicYear: "2",
        academicGroup: "A4"

      });

      student.save(function (err) {
        if (err) {
          should.fail('Save to database failed!');
        }
      });

      done();
    });

    /*******************************************************/

    after(function () {
      studentModel.remove({
        user: SAMPLE_USER
      }, handleRemoveResult);

      studentModel.remove({
        user: "ciucalete@facebook"
      }, handleRemoveResult);

      Mongoose.connection.close();
      done();
    });
  });
});
