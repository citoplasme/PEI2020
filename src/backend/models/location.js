var mongoose = require('mongoose');

var LocationSchema = new mongoose.Schema({
    country: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Location', LocationSchema, 'locations');