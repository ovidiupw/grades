'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const SchemaConstraints = require('../constants/schema-constraints');

let Errors = require('../constants/errors');
let Error = require('../modules/error');

let User = (function() {

  const _SCHEMA_NAME = 'Users';
  /**
   * The 'Users' collection schema.
   */
  const _schema = new Schema({
    user: {
      type: String,
      required: true,
      index: {
        unique: true,
        dropDups: true
      },
      minLength: SchemaConstraints.userMinLength,
      maxLength: SchemaConstraints.userMaxLength
    },
    facultyIdentity: {
      type: String,
      minLength: SchemaConstraints.facultyIdentityMinLength,
      maxLength: SchemaConstraints.facultyIdentityMaxLength
    },
    apiKey: {
      type: String,
      minLength: SchemaConstraints.apiKeyMinLength,
      maxLength: SchemaConstraints.apiKeyMaxLength
    },
    keyExpires: {
      type: Date
    },
    identityConfirmed: {
      type: Boolean
    }
  });

  _schema.statics.addFacultyIdentity = function (docId, facultyIdentity, error) {
    return this.update({
        _id: docId
      }, {
        facultyIdentity: facultyIdentity
      },
      function (err) {
        if (err) {
          return error(new Error(
            Errors.IDENTITY_CONFIRMATION_FAILED.id,
            Errors.IDENTITY_CONFIRMATION_FAILED.message,
            err
          ));
        }
      });
  };

  _schema.statics.updateFacultyIdentity = function (docId, facultyIdentity, error) {
    return this.update({
      _id: docId
    }, {
      $set: {
        facultyIdentity: facultyIdentity
      }
    }, function (err) {
      if (err) {
        return error(new Error(
          Errors.IDENTITY_CONFIRMATION_FAILED.id,
          Errors.IDENTITY_CONFIRMATION_FAILED.message,
          err
        ));
      }
    });
  };

  _schema.statics.findByUser = function (user, success, error) {
    return this.findOne({
      user: user
    }, function (err, foundUser) {
      if (err) {
        return error(new Error(
          Errors.DATABASE_ACCESS_ERROR.id,
          Errors.DATABASE_ACCESS_ERROR.message,
          err
        ));
      }
      if (!foundUser) {
        return error(new Error(
          Errors.USER_NOT_FOUND.id,
          Errors.USER_NOT_FOUND.message,
          "User " + user + " could not be found."
        ));
      } else {
        return success(foundUser);
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

module.exports = User;
