'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const DB = require('../config/database');

const Errors = require('../constants/errors');
const Error = require('../modules/error');

Mongoose.createConnection(DB.TEST_DB);

let Course = (function () {

    const _SCHEMA_NAME = 'Courses';
    /**
     * The 'Courses' collection schema.
     */
    const _schema = new Schema({
        courseId: {
            type: String,
            required: true,
            index: {
                unique: true,
                dropDups: true
            }
        },
        modules: [{
            moduleId: String
        }],
        title: {
            type: String,
            required: true
        },
        year: {
            type: String,
            required: true
        },
        semester: {
            type: String,
            required: true
        },
        evaluation: String
    });
    _schema.index({
        year: 1,
        semester: 1
    });


    _schema.statics.findByCourseId = function (courseId, success, error) {
        this.findOne({
            courseId: courseId
        }, function (err, foundCourse) {
            if (err) {
                error(new Error(
                    Errors.DATABASE_ACCESS_ERROR.id,
                    Errors.DATABASE_ACCESS_ERROR.message,
                    err
                ));
            }
            if (!foundCourse) {
                error(new Error(
                    Errors.COURSE_NOT_FOUND.id,
                    Errors.COURSE_NOT_FOUND.message,
                    "The course " + courseId + " could not be found."
                ));
            } else {
                success(foundCourse);
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

module.exports = Course;
