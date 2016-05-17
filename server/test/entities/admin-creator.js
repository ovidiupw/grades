'use strict'; // e.g. use strict scoping via let

const assert = require('assert');
const should = require('should');
const chai = require('chai');

const DB = require('../../app/config/database');
const Mongoose = require('mongoose');

const Registration = require('../../app/entities/registration');
const PredefinedRoles = require('../../app/constants/roles');

Mongoose.connect(DB.PRODUCTION_DB);

describe('Configuration of admin account', function () {
  it('Creates admin faculty identity (registration) with roles', function (done) {
    let adminRegistration = new Registration.model({
      facultyIdentity: "ovidiu.pricop@info.uaic.ro",
      roles: [PredefinedRoles.administrator.title]
    });

    adminRegistration.save(function (err) {
      if (err) done(err);
    });

    done();
  });
});

after(function (done) {
  Mongoose.connection.close();
  done();
});
