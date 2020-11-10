var mongoose = require('mongoose');

var LocationSchema = new mongoose.Schema({
    coountry: {
        type: String,
        required: true
    },
    cities: {
        type: [String],
        required: true
    }
});

module.exports = mongoose.model('Location', LocationSchema, 'locations');