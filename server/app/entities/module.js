'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const SchemaConstraints = require('../constants/schema-constraints');

let Module = (function () {

  const _SCHEMA_NAME = 'Module';
  /**
   * The 'Modules' collection schema.
   */
  const _schema = new Schema({
    moduleId: {
      type: String,
      required: true,
      index: {
        unique: true,
        dropDups: true
      }
    },
    title: {
      type: String
    },
    courseId: {
      type: String,
      required: true
    },
    createdBy: {
      type: String,
      minlength: SchemaConstraints.facultyIdentityMinLength,
      maxlength: SchemaConstraints.facultyIdentityMaxLength
    },
    minToPromote: {
      type: String
    },
    formula: {
      type: String
    },
    min: {
      type: Number
    },
    max: {
      type: Number
    }
  });
  _schema.index({
    moduleId: 1
  });

  const _model = Mongoose.model(_SCHEMA_NAME, _schema);

  return ({
    schemaName: _SCHEMA_NAME,
    schema: _schema,
    model: _model
  });

})();

module.exports = Module;
