'use strict';

const assert = require('assert');
const should = require('should');
const chai = require('chai');
const supertest_request = require('supertest');

const DB = require('../../app/config/database');
const Mongoose = require('mongoose');

let request = supertest_request('http://localhost:8082');

const RouteNames = require('../../app/constants/routes');

Mongoose.connect(DB.TEST_DB);

 describe(RouteNames.ROOT, function () {
  it('Responds with the api version and last update time in a json', function (done) {
    request.get(RouteNames.ROOT)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(assertBodyIsCorrect)
      .end(done);
  });
});

function assertBodyIsCorrect(res) {
  let rb = res.body;
  /* short form for elegant code */

  if (!rb.hasOwnProperty('api_version')) throw new Error("Missing api_version.");
  if (!rb.hasOwnProperty('last_update_date')) throw new Error("Missing last_update_date.");
}

describe(RouteNames.ROOT, function () {
  it('Responds with 404 if invalid path', function (done) {
    request.get(RouteNames.ROOT + "ahmed$ak47mahid$ablauh")
      .set('Accept', 'application/json')
      .expect(404, done);
  });
});
