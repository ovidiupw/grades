'use strict';

let email   = require("emailjs");

let Mailer = (function() {
  const _server = email.server.connect({
    user: 'grades.app.noreply@gmail.com',
    password: 'GradesMakesBetter247',
    host: 'smtp.gmail.com',
    ssl: true
  });

  const _sendEmail = function(message, errorCallback, successCallback) {
    _server.send(message, function(err, message) {
      if (err) {
        return errorCallback(err);
      } else {
        return successCallback(message);
      }
    })
  }

  return ({
    sendEmail: _sendEmail
  })
})();

module.exports = Mailer;