'use strict';

let async = require('async');

let Student = require('../../entities/student');

let ListStudents = (function () {

  let _invoke = function (req, res) {
    async.waterfall([

      function (callback) {
        Student.model.find({}, function (err, students) {
          if (err) {
            return callback(err);
          } else {
            return callback(null, students);
          }
        });
      },

      function (students, callback) {
        res.status(200);
        res.send(students);
      }

    ], function (err, results) {
      if (err) {
        res.status(400);
        res.send(err);
      }
    });

  };

  return {
    invoke: _invoke
  }
})();

module.exports = ListStudents;