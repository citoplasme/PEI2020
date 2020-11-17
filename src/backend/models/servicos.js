var mongoose = require('mongoose');

var ServiceSchema = mongoose.Schema({
    datetime: {
        type: Date,
        default: Date.now
    },
    user: {
        type: String
    },
    value: { 
        type: String
    }
});

// Services Schema
var ServiceSchema = mongoose.Schema({
	_id: {
		
    },
    client: {
        type: String
    },
    service_provider: {
        type: String
    },
    urgent: {
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
            payment: {
                type: Number
            },
            ponctuality: {
                type: Number
            },
            security : {
                type: Number
            },
            general: {
                type: Number
            },
            comentario: {
                type: String
            },
            karma: {
                type: Number
            }
        },
        service_provider: {
            ponctuality: {
                type: Number
            },
            quality: {
                type: Number
            },
            security: {
                type: Number
            },
            attendance: {
                type: Number
            },
            general: {
                type: Number
            },
            comentario: {
                type: String
            },
            karma: {
                type: Number
            }
        }
    },
    orcamento: {
        type: [orcamentoSquema]
    }
});

module.exports = mongoose.model('Service', ServiceSchema, 'services');