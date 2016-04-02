const DB = require('../app/config/database');

const Assert = require('assert');
var should = require('should');
const Mongoose = require('mongoose');
const User = require('../app/entities/user');

Mongoose.connect(DB.DATABASE_ADDRESS);

var UserModel = User.model;

var TEST_USER = "test_user";
var TEST_PASSWORD = "test_password";

var user = new UserModel({
	user: TEST_USER,
	password: TEST_PASSWORD
});

describe('User database serialization and deserialization', function() {

	beforeEach(function(done) {
		user.save(function(err) {
			if(err) {
				throw err;
			}
			console.log('User saved successfully!');
			done();
		});
	});

	it("Finds the inserted user, searching by user", function(done) {
		User.findByUser("test_user",
			function(doc) {
				doc.password.should.equal(user.password);
				doc.user.should.equal(user.user);
				done();
			},
			function(err) {
				console.log(err);
				done();
			});


	});

	afterEach(function(done) {
		UserModel.remove({}, function(err, doc, result) {
			if (err) {
				throw err;
			}
			console.log('Cleared database.');
			done();
		});


	});
});
