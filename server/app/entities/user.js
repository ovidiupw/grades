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
		user: { type: String, required: true, index: {unique: true, dropDups: true},
		minlength: SchemaConstraints.userMinLength,
		maxlength: SchemaConstraints.userMaxLength
		},
		facultyIdentity:  { type: String,
			minlength: SchemaConstraints.facultyIdentityMinLength,
			maxlength: SchemaConstraints.facultyIdentityMaxLength
		},
		apiKey: { type: String,
			minlength: SchemaConstraints.apiKeyMinLength,
			maxlength: SchemaConstraints.apiKeyMaxLength
		},
		keyExpires: { type: Date },
		identityConfirmed: { type: Boolean }
	});

	_schema.statics.addFacultyIdentity = function(docId, facultyIdentity, error) {
    this.update({
        _id: docId
      },{
        facultyIdentity: facultyIdentity,
      },
      function(err) {
        if (err) {
          error(new Error(
            Errors.LOGIN_ERROR.id, Errors.LOGIN_ERROR.message), err);
        }
				console.log("HERHERHERH" + "   " + docId + " " + facultyIdentity);
      });
  };

	_schema.statics.updateFacultyIdentity = function(docId, facultyIdentity, error) {
    this.update({
      _id: docId
    }, {
      $set: {
        facultyIdentity: facultyIdentity,
      }
    }, function(err) {
      if (err) {
        error(new Error(
          Errors.LOGIN_ERROR.id, Errors.LOGIN_ERROR.message), err);
      }
    });
  };

	_schema.statics.findByUser = function (user, success, error) {
		this.findOne({user: user}, function(err, foundUser) {
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
						"User " + user + " could not be found."
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

module.exports = User;
