'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

let Grade = (function () {

  const _SCHEMA_NAME = 'Grade';
  /**
   * The 'Grades' collection schema.
   */
  const _schema = new Schema({
    registrationNumber: {
      type: String,
      required: true,
      index: {
        unique: true,
        dropDups: true
      }
    },
    courseId: {
      type: String
    },
    moduleId: {
      type: String
    },
    grades: [{
      value: {
        type: Double
      },
      date: {
        type: Date
      }
    }]

  });
  _schema.index({
    courseId: 1,
    moduleId: 1
  });

  const _model = Mongoose.model(_SCHEMA_NAME, _schema);

  return ({
    schemaName: _SCHEMA_NAME,
    schema: _schema,
    model: _model
  });

})();

module.exports = Grade;
