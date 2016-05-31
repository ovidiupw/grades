'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const SchemaConstraints = require('../constants/schema-constraints');

const Errors = require('../constants/errors');
let Error = require('../modules/error');
const RegistrationClasses = require('../constants/registration-classes');

const Utility = require('../modules/utility');

let randomstring = require("randomstring");


let Registration = (function () {

  let _assertAtLeastOneFacultyStatusExists = {
    validator: function (facultyStatuses) {
      return facultyStatuses.length >= 1;
    },
    message: 'Please supply an array containing at least one faculty' +
    'status (as a string) from the following: ' +
    `${ Utility.buildDelimiterSeparatedObjectKeys(RegistrationClasses, ',')}`
  };

  let _validateFacultyStatus = {
    validator: function (facultyStatus) {

      for (let registrationClass in RegistrationClasses) {
        if (RegistrationClasses.hasOwnProperty(registrationClass)) {
          if (facultyStatus.toLowerCase() === RegistrationClasses[registrationClass]) {
            return true;
          }
        }

      }
      return false;
    },
    message: 'One of the supplied facultyStatuses was invalid. Please supply ' +
    'one of the following statuses: ' +
    `${ Utility.buildDelimiterSeparatedObjectKeys(RegistrationClasses, ',')}`
  };

  const _SCHEMA_NAME = 'Registrations';
  /**
   * The 'Registrations' collection schema.
   */
  const _schema = new Schema({
    facultyIdentity: {
      type: String,
      required: [true, "facultyIdentity property is required"],
      index: {
        unique: true,
        dropDups: true
      },
      minlength: SchemaConstraints.facultyIdentityMinLength,
      maxlength: SchemaConstraints.facultyIdentityMaxLength
    },
    facultyStatus: {
      type: [{
        type: String,
        validate: _validateFacultyStatus
      }],
      required: [true, "facultyStatus property is required."],
      validate: _assertAtLeastOneFacultyStatusExists
    },
    roles: [{
      type: String,
      minlength: SchemaConstraints.roleTitleMinLength,
      maxlength: SchemaConstraints.roleTitleMaxLength
    }],
    identitySecret: {
      type: String,
      minlength: SchemaConstraints.identitySecretMinLength,
      maxlength: SchemaConstraints.identitySecretMaxLength
    }
  });

  _schema.methods.generateIdentitySecret = function (errCallback, successCallback) {
    let _generatedIdentitySecret = randomstring.generate({
      length: 6,
      charset: 'numeric'
    });

    process.nextTick(() => {
      this.model(_SCHEMA_NAME).update({
        _id: this._id
      }, {
        $set: {
          identitySecret: _generatedIdentitySecret
        }
      }, function (error) {
        if (error) {
          return errCallback(error);
        } else {
          return successCallback(_generatedIdentitySecret);
        }
      });
    });
  };

  _schema.statics.findByFacultyIdentity = function (fid, success, error) {
    process.nextTick(() => {
      this.findOne({
        facultyIdentity: fid
      }, function (err, foundRegistration) {
        if (err) {
          return error(new Error(
            Errors.DATABASE_ACCESS_ERROR.id,
            Errors.DATABASE_ACCESS_ERROR.message,
            err
          ));
        }
        if (!foundRegistration) {
          return error(new Error(
            Errors.REGISTRATION_NOT_FOUND.id,
            Errors.REGISTRATION_NOT_FOUND.message,
            "Registration with facultyIdentity #" + fid + "# could not be found."
          ));
        } else {
          return success(foundRegistration);
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

module.exports = Registration;
