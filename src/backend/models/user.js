var mongoose = require('mongoose');

// User Schema
var UserSchema = mongoose.Schema({
	_id: {
		
	},
	internal: {
		type: Boolean,
	},
	level: {
		type: Number,
	},
	permissions: {
		LC: {
			type: Boolean,
		},
		AE: {
			type: Boolean,
		},
		ES: {
			type: Boolean,
		},
	},
	email: {
		type: String,
		index: true
	},
	name: {
		type: String
	},
	nCalls: {
		type: Number,
		default: 0
    },
	local: {
		password: {
			type: String
		}
	},
	categorias: [String],
	subcategorias: [String],
	servicos_realizados: {
		type: Number,
		default: 0
	},
	karma: {
		type: Number,
		default: 0
	},
	termsofservice: {
		type: Boolean,
	}
});

module.exports = mongoose.model('User', UserSchema, 'users');
