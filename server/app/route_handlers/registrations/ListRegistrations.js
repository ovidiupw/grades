'use strict';

let async = require('async');

let Registration = require('../../entities/registration');

let ListRegistrations = (function () {

  let _invoke = function (req, res) {
    async.waterfall([

      function (callback) {
        Registration.model.find({}, function (err, registrations) {
          if (err) {
            return callback(err);
          } else {
            return callback(null, registrations);
          }
        });
      },

      function (registrations, callback) {
        res.status(200);
        res.send(registrations);
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

module.exports = ListRegistrations;