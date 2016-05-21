'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const SchemaConstraints = require('../constants/schema-constraints');

let Errors = require('../constants/errors');
let Error = require('../modules/error');

let randomstring = require("randomstring");


let Registration = (function() {

  const _SCHEMA_NAME = 'Registrations';
  /**
   * The 'Registrations' collection schema.
   */
  const _schema = new Schema({
    facultyIdentity: {
      type: String,
      required: true,
      index: {
        unique: true,
        dropDups: true
      },
      minlength: SchemaConstraints.facultyIdentityMinLength,
      maxlength: SchemaConstraints.facultyIdentityMaxLength
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
    process.nextTick(() => {
      this.model(_SCHEMA_NAME).update({
        _id: this._id
      }, {
        $set: {
          identitySecret: randomstring.generate({
            length: 6,
            charset: 'numeric'
          })
        }
      }, function (error) {
        if (error) {
          return errCallback(error);
        } else {
          return successCallback();
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
            "Registration with facultyIdentity '" + fid + "' could not be found."
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
