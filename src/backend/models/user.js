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
	categorias: {
		type: [String], // [_id]
		default: []  
	},
	subcategorias: {
		type: [String], // [_id]
		default: [] 
	},
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
		default: false,
		// required: true
	},
	photo: {
		type: String // Base64 encoding image
	},
	locations: {
		type: [String],
		default: []
	}
});

module.exports = mongoose.model('User', UserSchema, 'users');
