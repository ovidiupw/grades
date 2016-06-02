'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const SchemaConstraints = require('../constants/schema-constraints');
const DB = require('../config/database');

const Errors = require('../constants/errors');
const Error = require('../modules/error');

Mongoose.createConnection(DB.TEST_DB);

let Student = (function () {

  const _SCHEMA_NAME = 'Students';
  /**
   * The 'Students' collection schema.
   */
  const _schema = new Schema({
    facultyIdentity: {
      type: String,
      minlength: SchemaConstraints.facultyIdentityMinLength,
      maxlength: SchemaConstraints.facultyIdentityMaxLength,
      required: true

    },
    registrationNumber: {
      type: String,
      unique: true,
      required: true
    },
    birthDate: {
      type: Date,
      required: true
    },
    academicYear: {
      type: String,
      required: true
    },
    academicGroup: {
      type: String,
      required: true
    }
  });
  _schema.index({
    facultyIdentity: 1
  });

  _schema.methods.insert = function () {
    this.model(_SCHEMA_NAME).save(function (err) {
      if (err) throw err;
    });
  };
  _schema.statics.findByFacultyIdentity = function (facultyIdentity, success, error) {
    process.nextTick(() => {
      this.findOne({
        facultyIdentity: facultyIdentity
      }, function (err, foundStudent) {
        if (err) {
          error(new Error(
            Errors.DATABASE_ACCESS_ERROR.id,
            Errors.DATABASE_ACCESS_ERROR.message,
            err
          ));
        }
        if (!foundStudent) {
          error(new Error(
            Errors.STUDENT_NOT_FOUND.id,
            Errors.STUDENT_NOT_FOUND.message,
            "Student " + facultyIdentity + " could not be found."
          ));
        } else {
          success(foundStudent);
        }
      });
    });
  };

  const _model = Mongoose.model(_SCHEMA_NAME, _schema);

  return ({
    schemaName: _SCHEMA_NAME,
    schema: _schema,
    model: _model
  });

})();

module.exports = Student;
