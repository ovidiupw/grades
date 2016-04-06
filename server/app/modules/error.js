'use strict';

let Error = function(_code, _message, _data) {
  return ({
    code: _code,
    message: _message,
    data: _data,
    error: true
  });
};

module.exports = Error;
