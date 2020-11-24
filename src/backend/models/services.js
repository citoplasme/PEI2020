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

var Services = require('../controllers/api/services.js');

// After an update, this trigger is released
ServiceSchema.post("update", function(doc) { // utilizar para mudar o status para 4 após as reviews estarem presentes
    // e quando o estado fica a 4 -> atualizar karma dos dois intervenientes
    
    // Get the updated _id
    if(this._conditions._id){
        Services.consultar(this._conditions._id)
            .then(data => {
                // Check if both reviews are present
                if(data && data.status && data.status === 3 && data.review && data.review.client && data.review.service_provider && data.review.client.karma && data.review.service_provider.karma){
                    Services.update_status(this._conditions._id, 4)
                        .then(data => {
                            console.log("Status succesfully updated for service: " + this._conditions._id)
                        })
                        .catch(error => {
                            console.log("An error occurred while checking the status for service " + this._conditions._id + ": " + error);
                        })
                }
            })
            .catch(error => {
                console.log("An error occurred while checking the status for service " + this._conditions._id + ": " + error);
            })
    }
    
});

module.exports = mongoose.model('Service', ServiceSchema, 'services');