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
		content: {
			type: String
		},
		extension: {
			type: String
		}
	},
	locations: {
		type: [String],
		default: []
	}
});

var Users = require('../controllers/api/users.js');

// After an update, this trigger is released
UserSchema.post("findOneAndUpdate", function(doc) { // utilizar para mudar o level para 3.5 após 100 servicos realizados
	// Get the updated _id
    if(this._conditions && this._conditions._id){
        Users.consultar(this._conditions._id)
            .then(data => {
				// Check if the number of servicos realizados reached 100
                if(data && data.servicos_realizados && data.servicos_realizados >= 100 && data.level && data.level === 3){
                    Users.update_level(this._conditions._id, 3.5)
                        .then(data => {
                            console.log("Level succesfully updated for user: " + this._conditions._id)
                        })
                        .catch(error => {
                            console.log("An error occurred while checking the number of services for user " + this._conditions._id + ": " + error);
                        })
                }
            })
            .catch(error => {
                console.log("An error occurred while checking the number of services for user " + this._conditions._id + ": " + error);
            })
    }
});

module.exports = mongoose.model('User', UserSchema, 'users');
