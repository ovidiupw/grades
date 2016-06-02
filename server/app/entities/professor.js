'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const SchemaConstraints = require('../constants/schema-constraints');
const DB = require('../config/database');

const Errors = require('../constants/errors');
const Error = require('../modules/error');

Mongoose.createConnection(DB.TEST_DB);

let Professor = (function () {

  const _SCHEMA_NAME = 'professors';
  /**
   * The 'professors' collection schema.
   */
  const _schema = new Schema({
    facultyIdentity: {
      type: String,
      minlength: SchemaConstraints.facultyIdentityMinLength,
      maxlength: SchemaConstraints.facultyIdentityMaxLength,
      required: true
    },
    didacticGrade: {
      type: String,
      required: true
    },
    courses: [{
      courseId: String,
      academicGroups: Array
    }]
  });
  _schema.index({
    facultyIdentity: 1
  });

  _schema.methods.insert = function () {
    this.model(_SCHEMA_NAME).save(function (err) {
      if (err) throw err;
    });
  };
  _schema.statics.findByUser = function (facultyIdentity, success, error) {
    this.findOne({
      facultyIdentity: facultyIdentity
    }, function (err, foundProfessor) {
      if (err) {
        error(new Error(
          Errors.DATABASE_ACCESS_ERROR.id,
          Errors.DATABASE_ACCESS_ERROR.message,
          err
        ));
      }
      if (!foundProfessor) {
        error(new Error(
          Errors.PROFESSOR_NOT_FOUND.id,
          Errors.PROFESSOR_NOT_FOUND.message,
          "Professor " + facultyIdentity + " could not be found."
        ));
      } else {
        success(foundProfessor);
      }
    });
  };

  const _model = Mongoose.model(_SCHEMA_NAME, _schema);

  return ({
    schemaName: _SCHEMA_NAME,
    schema: _schema,
    model: _model
  });

})();

module.exports = Professor;
