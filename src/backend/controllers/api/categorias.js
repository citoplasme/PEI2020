var Categoria = require('../../models/categorias');
var AuthCall = require('../../models/auth');
//var bcrypt = require('bcryptjs');
var xml2js = require('xml2js');
var mongoose = require('mongoose');
const categorias = require('../../models/categorias');
const request = require('../../controllers/api/utils').request
const salt = 14

var Categorias = module.exports

Categorias.createCategoria = async function(newCategoria,callback){
    try{
        newCategoria.active=false;
        newCategoria = await newCategoria.save();
        callback(null,newCategoria);
    }catch(err){
        callback(err,null);
    }
}

Categorias.getCategoriaByName = function (name, callback) {
	var query = { name: name};
	Categoria.findOne(query, callback);
}

Categorias.validateCategoria = function (name, callback) {
	Categorias.getCategoriaByName(name, async function(err,cat){
        
        if(err){
            callback(err,null);
        } else{
            try{
                cat.active=true;
                cat = await cat.save();
                callback(null,cat);
            }catch(err){
		        callback(err, null);
            }
        }
    })
}
//Lista todas as categorias ativas e nao ativas
Categorias.getAllCategorias = function (req,callback){
    Categoria.find({},callback);
}

//Lista todas as categorias ativas (usado por utilizadores normais da plataforma)
Categorias.getAllCategoriasActive = function (req,callback){
    Categoria.find({"active":"true"},callback);
}

Categorias.deleteByName = function(name,callback){
    Categoria.findOneAndRemove({"name": name}, function(err, cat){
        if(err){
            callback(err, null);
        }else{
            //Devolve o elemento que fez delete
            callback(null, cat);
        }
    })
}