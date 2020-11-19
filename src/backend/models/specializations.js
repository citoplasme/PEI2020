var mongoose = require('mongoose');

var SpecializationSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String
    },
    active: {
        type: Boolean,
        require: true
    }
});

module.exports = mongoose.model('Specialization', SpecializationSchema, 'specializations');