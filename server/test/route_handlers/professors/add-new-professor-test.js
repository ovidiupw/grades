'use strict'; // e.g. use strict scoping via let

const assert = require('assert');
const should = require('should');
const chai = require('chai');
const expect = require('chai').expect;

const supertest_request = require('supertest');

const DB = require('../../../app/config/database');
const Mongoose = require('mongoose');

const User = require('../../../app/entities/user');
const Professor = require('../../../app/entities/professor');
const AddNewProfessor = require('../../../app/route_handlers/professors/AddNewProfessor');

const RouteNames = require('../../../app/constants/routes');

let request = supertest_request('http://localhost:8082');

Mongoose.connect(DB.TEST_DB);

describe('Add New Professor', function () {

    /* Test preparation */

    const SAMPLE_USER = 'doamnasecretara';
    const SAMPLE_USER2 = 'domnuciuc';
    const SAMPLE_FACULTY_IDENTITY = 'lavinia.piriu@info.uaic.ro';
    const SAMPLE_API_KEY = '974FD14068119E2D79041463D9E933C6B0DB62EE9AD881DCBEA4C40CF05ED3FD';
    const SAMPLE_KEY_EXPIRES = new Date(2017, 10, 31);
    const SAMPLE_IDENTITY_CONFIRMED = true;

    let userModel = User.model;
    let user = new userModel({
        user: SAMPLE_USER,
        facultyIdentity: SAMPLE_FACULTY_IDENTITY,
        apiKey: SAMPLE_API_KEY,
        keyExpires: SAMPLE_KEY_EXPIRES,
        identityConfirmed: SAMPLE_IDENTITY_CONFIRMED
    });

    let handleRemoveResult = function (err, removeResult) {
        if (err) throw err;
        if (removeResult.result.n !== 0) {
            console.log(`OK. Removed sample user. Cleanup successful!`);
        }
    };

    /* Test execution */

    before(function () {
        removeSampleUser(SAMPLE_USER);

        user.save(function (err) {
            if (err) throw err;
        });
    });

    it('searches for use in database', function (done) {
       done();
    });

    after(function (done) {
        removeSampleUser(SAMPLE_USER);

        done();
    });

    let removeSampleUser = function (userName) {
        userModel.remove({
            user: userName
        }, handleRemoveResult);
    };

});