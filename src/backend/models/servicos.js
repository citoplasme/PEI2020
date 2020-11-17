var mongoose = require('mongoose');

// Services Schema
var ServiceSchema = mongoose.Schema({
	_id: {
		
    },
    cliente: {
        type: String
    },
    service_provider: {
        type: String
    },
    urgente: {
        type: Boolean,
    },
    status: {
        type: Number,
        required: true
    },
    fatura: {
        type: String
    },
    review: {
        client: {
            comentario: {
                type: String
            },
            karma: {
                type: Number
            }
        },
        service_provider: {
            comentario: {
                type: String
            },
            karma: {
                type: Number
            }
        }
    },
    orcamento: [
        {
            datetime: {
                type: Date,
                default: Date.now
            },
            user: {
                type: String
            },
            value: { 
                type: Number
            }
        }
    ]
});

module.exports = mongoose.model('Service', UserSchema, 'services');