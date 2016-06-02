'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const SchemaConstraints = require('../constants/schema-constraints');

let Errors = require('../constants/errors');
let Error = require('../modules/error');
let PredefinedErrors = require('../modules/predefined-errors');

let User = (function () {

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
      minlength: SchemaConstraints.userMinLength,
      maxlength: SchemaConstraints.userMaxLength
    },
    facultyIdentity: {
      type: String,
      minlength: SchemaConstraints.facultyIdentityMinLength,
      maxlength: SchemaConstraints.facultyIdentityMaxLength
    },
    apiKey: {
      type: String,
      minlength: SchemaConstraints.apiKeyMinLength,
      maxlength: SchemaConstraints.apiKeyMaxLength
    },
    keyExpires: {
      type: Date
    },
    identityConfirmed: {
      type: Boolean
    }
  });

  _schema.statics.confirmFacultyIdentity = function (docId, error, success) {
    process.nextTick(() => {
      return this.update({
        _id: docId
      }, {
        $set: {
          identityConfirmed: true
        }
      }, function (err) {
        if (err) {
          return error(PredefinedErrors.getIdentityConfirmationError(err));
        } else {
          success();
        }
      });
    });
  };

  _schema.statics.addFacultyIdentity = function (docId, facultyIdentity, error) {
    process.nextTick(() => {
      return this.update({
          _id: docId
        }, {
          facultyIdentity: facultyIdentity
        },
        function (err) {
          if (err) {
            return error(PredefinedErrors.getIdentityConfirmationError(err));
          }
        });
    });
  };

  _schema.statics.updateFacultyIdentity = function (docId, facultyIdentity, error) {
    process.nextTick(() => {
      return this.update({
        _id: docId
      }, {
        $set: {
          facultyIdentity: facultyIdentity
        }
      }, function (err) {
        if (err) {
          return error(PredefinedErrors.getIdentityConfirmationError(err));
        }
      });
    });
  };

  _schema.statics.findByUser = function (user, success, error) {
    process.nextTick(() => {
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
    });
  };

  const _model = Mongoose.model(_SCHEMA_NAME, _schema);

  return ({
    schemaName: _SCHEMA_NAME,
    schema: _schema,
    model: _model
  });
})
();

module.exports = User;
