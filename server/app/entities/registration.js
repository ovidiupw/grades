'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const SchemaConstraints = require('../constants/schema-constraints');

//let Errors = require('../constants/errors');
//let Error = require('../modules/error');

let Registration = (function() {

	const _SCHEMA_NAME = 'Registrations';
	/**
	 * The 'Registrations' collection schema.
	 */
	const _schema = new Schema({
		facultyIdentity: { type: String, required: true, index: {unique: true, dropDups: true},
      minlength: SchemaConstraints.facultyIdentityMinLength,
      maxlength: SchemaConstraints.facultyIdentityMaxLength
    },
		roles: [{ type: String }],
		identitySecret: { type: String,
      minlength: SchemaConstraints.identitySecretMinLength,
      maxlength: SchemaConstraints.identitySecretMaxLength
    }
	});

	const _model = Mongoose.model(_SCHEMA_NAME, _schema);

	return ({
		schemaName: _SCHEMA_NAME,
		schema: _schema,
		model: _model
	});
})();

module.exports = Registration;
