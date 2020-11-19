var mongoose = require('mongoose');

var CategoriaSchema = mongoose.Schema({
	name:{
		type: String,
		required: true
	},
	desc:{
		type: String ,
	},
	active:{
		type: Boolean,
		required: true
	}
});

module.exports = mongoose.model('Categorie', CategoriaSchema, 'categories');
