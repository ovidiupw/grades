var Mongoose = require('mongoose');
var Schema = require('mongoose').Schema;

var User = (function() {

	var USER_MODEL = 'User';

	var _userSchema = new Schema({
		user: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		role: String,
		subordonateRoles: Array,
		actions: Array,
		apiKey: String,
		keyExpires: Date,
		identityConfirmed: Boolean
	});


	var _model = Mongoose.model(USER_MODEL, _userSchema);

	_findByUser = function (user, success, fail) {
		_model.findOne({ user: user}, function(err, doc) {
			if (err) {
				fail(err);
			} else {
				success(doc);
			}
		});
	};

	return {
		findByUser : _findByUser,
		schema : _userSchema,
		model : _model
	};
})();

module.exports = User;
