'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const SchemaConstraints = require('../constants/schema-constraints');

const RouteNames = require('../constants/routes');

let Errors = require('../constants/errors');
let Error = require('../modules/error');

let Role = (function() {

  const _VERB_FORMAT = [
    /^(GET|PUT|POST|PATCH|DELETE)$/,
    "The supplied HTTP verb is not supported."
  ];

  const _resourceValidator = {
    validator: function (value) {
      for (let property in RouteNames) {
        if (RouteNames.hasOwnProperty(property)) {
          if (RouteNames[property] === value) {
            return true;
          }
        }
      }
      return false;
    },
    message: 'Resource validation (`{PATH}`) failed with value `{VALUE}` '
    + ' - Unknown resource.'
  };

  const _SCHEMA_NAME = 'Roles';
  /**
   * The 'Roles' collection schema.
   */
  const _schema = new Schema({
    title: {
      type: String,
      required: true,
      index: {
        unique: true,
        dropDups: true
      },
      minlength: SchemaConstraints.roleTitleMinLength,
      maxlength: SchemaConstraints.roleTitleMaxLength
    },
    actions: [{
      verb: {
        type: String,
        match: _VERB_FORMAT
      },
      resource: {
        type: String,
        validate: _resourceValidator
      }
    }]
  });

  _schema.methods.insert = function () {
    process.nextTick(() => {
      this.model(_SCHEMA_NAME).save(function (err) {
        if (err) throw err;
      });
    });
  };

  _schema.statics.findByTitle = function (title, success, error) {
    process.nextTick(() => {
      this.findOne({
        title: title
      }, function (err, foundRole) {
        if (err) {
          return error(new Error(
            Errors.DATABASE_ACCESS_ERROR.id,
            Errors.DATABASE_ACCESS_ERROR.message,
            err
          ));
        }
        if (!foundRole) {
          return error(new Error(
            Errors.ROLE_NOT_FOUND.id,
            Errors.ROLE_NOT_FOUND.message,
            "Role with title " + title + " could not be found."
          ));
        } else {
          return success(foundRole);
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

module.exports = Role;
