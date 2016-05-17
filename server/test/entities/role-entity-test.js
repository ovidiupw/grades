'use strict'; // e.g. use strict scoping via let

const assert = require('assert');
const should = require('should');
const chai = require('chai');

const DB = require('../../app/config/database');
const Mongoose = require('mongoose');

const Role = require('../../app/entities/role');
const PredefinedRoles = require('../../app/constants/roles');

Mongoose.connect(DB.TEST_DB);

describe('Roles entity serialization and deserialization', function () {

  let adminRole = new Role.model(PredefinedRoles.administrator);

  let handleRemoveResult = function (err, removeResult) {
    if (err) throw err;
    if (removeResult.result.n !== 0) {
      console.log(`OK. Removed sample role. Cleanup successful!`);
    }
  };

  /* Test execution */

  before(function () {
    Role.model.remove({
      title: PredefinedRoles.administrator.title
    }, handleRemoveResult);

    adminRole.save(function (err) {
      if (err) throw err;
    });
  });

  /*******************************************************/

  it('Finds the administrator role via its title in the database', function (done) {
    Role.model.findOne({
      title: PredefinedRoles.administrator.title
    }, function (err, foundRole) {
      if (err) {
        done(err);
      }
      assert.equal(foundRole.title, adminRole.title);
      //assert.deepEqual(foundRole.actions, PredefinedRoles.administrator.actions);
      done();
    });
  });

  /*******************************************************/

  it('Uses findByTitle to find role via its title in the databse', function (done) {
    Role.model.findByTitle(
      PredefinedRoles.administrator.title,
      function (foundRole) {
        assert.equal(PredefinedRoles.administrator.title, foundRole.title);
      },
      function (error) {
        done(error);
      }
    );

    done(); // Found the role
  });

  /*******************************************************/

  it('Should require at least the role title field on insertion', function (done) {
    /* Test for both null and undefined */

    adminRole.title = undefined;
    adminRole.save(function (err) {
      if (!err) {
        should.fail('Role title should be required. Check the schema!');
      }
    });

    adminRole.title = null;
    adminRole.save(function (err) {
      if (!err) {
        should.fail('Role title should be required. Check the schema!');
      }
    });

    done();
  });

  /*******************************************************/

  it('Should serialize and deserialze a fully specified role', function (done) {

    Role.model.update({
      title: PredefinedRoles.administrator.title
    }, {$set: {actions: PredefinedRoles.administrator.actions}}, function (err, updatedRole) {
      if (err) throw err;
    });

    Role.model.findOne({title: PredefinedRoles.administrator.title},
      function (err, foundRole) {
        if (err) should.fail('Failed when saving administrator role in the database.');
        if (!foundRole) {
          should.fail('Should have found the administrator role in the database');
        }

        assert.equal(foundRole.title, PredefinedRoles.administrator.title);
        assert.equal(foundRole.actions[0].verb, PredefinedRoles.administrator.actions[0].verb);
        assert.equal(foundRole.actions[1].verb, PredefinedRoles.administrator.actions[1].verb);

        assert.equal(foundRole.actions[0].resource, PredefinedRoles.administrator.actions[0].resource);
        assert.equal(foundRole.actions[1].resource, PredefinedRoles.administrator.actions[1].resource);
        done();
      }
    );
  });

  /*******************************************************/

  it('Should not register a role with length(title) < minLength(title) defined in schema.', function () {
    let newRole = new Role.model({
      title: "a"
    });

    newRole.save(function (err) {
      if (err) throw err;
    });

    Role.model.findOne({title: "a"}, function (err, foundRole) {
      if (err) throw err;
      if (foundRole) should.fail("Shouldn't have been able to insert an invalid role.");
    });
  });

  /*******************************************************/

  after(function () {
    Role.model.remove({
      title: PredefinedRoles.administrator.title
    }, handleRemoveResult);

    Mongoose.connection.close();
    done();
  });

});
