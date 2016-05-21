'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const SchemaConstraints = require('../constants/schema-constraints');
const DB = require('../config/database');
let Errors = require('../constants/errors');

const Errors = require('../constants/errors');
const Error = require('../modules/error');

Mongoose.createConnection(DB.TEST_DB);

let Professor = (function () {

  const _SCHEMA_NAME = 'Professors';
  /**
   * The 'Professors' collection schema.
   */
  const _schema = new Schema({
    facultyIdentity: {
      type: String,
      minlength: SchemaConstraints.facultyIdentityMinLength,
      maxlength: SchemaConstraints.facultyIdentityMaxLength,
      required: true
    },
    gradDidactic: {
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
  _schema.statics.findByUser = function (user, success, error) {
    this.findOne({
      user: user
    }, function (err, foundUser) {
      if (err) {
        error(new Error(
          Errors.DATABASE_ACCESS_ERROR.id,
          Errors.DATABASE_ACCESS_ERROR.message,
          err
        ));
      }
      if (!foundUser) {
        error(new Error(
          Errors.USER_NOT_FOUND.id,
          Errors.USER_NOT_FOUND.message,
          "Professor " + user + " could not be found."
        ));
      } else {
        success(foundUser);
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
