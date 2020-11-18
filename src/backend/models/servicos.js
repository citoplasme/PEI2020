var mongoose = require('mongoose');

var orcamentoSquema = mongoose.Schema({
    datetime: {
        type: Date,
        default: Date.now,
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
        required: true,
        default: 0
    },
    desc : {
        type: String
    },
    fatura: {
        type: String // Base 64 encoding
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
            },
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
    },
    date: {
        type: String
    },
    hour: {
        type: String
    },
    duration: {
        type: String
    }
}, { minimize: false });

// After an update, this trigger is released
ServiceSchema.post("update", function(doc) { // utilizar para mudar o status para 4 após as reviews estarem presentes
    console.log('Updated'); // e quando o estado fica a 4 -> atualizar karma dos dois intervenientes
    console.log(this)
    console.log(doc)
});

module.exports = mongoose.model('Service', ServiceSchema, 'services');