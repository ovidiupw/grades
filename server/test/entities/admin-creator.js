'use strict'; // e.g. use strict scoping via let

const assert = require('assert');
const should = require('should');
const chai = require('chai');

const DB = require('../../app/config/database');
const Mongoose = require('mongoose');

const Registration = require('../../app/entities/registration');
const PredefinedRoles = require('../../app/constants/roles');
const RegistrationClasses = require('../../app/constants/registration-classes');

Mongoose.connect(DB.PRODUCTION_DB);

describe('Configuration of admin account', function () {
  it('Creates admin faculty identity (registration) with roles', function (done) {

    let adminRegistration = new Registration.model({
      facultyIdentity: "ovidiu.pricop@gmail.com",
      facultyStatus: [RegistrationClasses.DEVELOPER],
      roles: [PredefinedRoles.administrator.title]
    });

    adminRegistration.save(function (err) {
      if (err) return done(err);
      return done();
    });
  });
});

after(function (done) {
  done();
});
