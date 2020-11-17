var mongoose = require('mongoose');

//SubCategoriaSchema
var SubCategoriaSchema = mongoose.Schema({
	_id: {
		
	},
	name:{
		type: String,
	},
	desc:{
		type: String ,
	},
	status:{
		type: Number,
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
	status:{
		type: Number,
	},
	subCategorias:[SubCategoriaSchema]

});

module.exports = mongoose.model('Categoria', CategoriaSchema, 'categorias');
