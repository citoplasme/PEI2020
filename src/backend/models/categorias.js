var mongoose = require('mongoose');

//SubCategoriaSchema
var SubCategoriaSchema = mongoose.Schema({
	_id: {
		
	},
	name:{
		type: String,
	},
	desc:{
		String ,
	},
	active:{
		type: Boolean,
	}
});

// Categoria Schema
var CategoriaSchema = mongoose.Schema({
	_id: {
		
	},
	name:{
		type: String,
	},
	desc:{
		type: String ,
	},
	active:{
		type: Boolean,
	},
	subCategorias:[SubCategoriaSchema]

});

module.exports = mongoose.model('Categoria', CategoriaSchema, 'categorias');
