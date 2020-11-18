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
        newCategoria.status=0;
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

Categorias.editCategoria = function (categoria, callback) {
	Categorias.getCategoriaByName(categoria.name, async function(err,cat){
        
        if(err){
            callback(err,null);
        } else{
            try{
                if (categoria.status!=null)
                    cat.status=categoria.status;
                if (categoria.desc!=null)
                    cat.desc=categoria.desc;
                cat = await cat.save();
                callback(null,cat);
            }catch(err){
		        callback(err, null);
            }
        }
    })
}

//Lista todas as categorias ativas (usado por utilizadores normais da plataforma)
Categorias.getAllCategorias = function (filtro,callback){
    Categoria.find(filtro,callback);
}

Categorias.deleteCategoriaByName = function(name,callback){
    Categoria.findOneAndRemove({"name": name}, function(err, cat){
        if(err){
            callback(err, null);
        }else{
            //Devolve o elemento que fez delete
            callback(null, cat);
        }
    })
}


//to do
//edit sub categoria
//edit categoria

//add sub categoria to categoria
//vai receber sempre uma categoria com apenas um elemento no array das sub categorias
Categorias.createSubCategoria = async function(cat,callback){
    
    //vai verificar se a categoria existe
    Categorias.getCategoriaByName(cat.name,function(err,getcat){
        if(err){
            callback(err,null);
        } else{
            //se a categoria existir vai verificar se a sub categoria existe
            if (getcat!=null){
                Categorias.getCategoriaByName(cat.name,function(err,foundCat){
                    if (err){
                        callback(err,null);
                    }
                    else{
                        encontrou=false;
                        //vai verificar cada elemento do array a ver se ja tem la dentro a sub categoria
                        Categorias.getSubCategoriaByName(cat.name,cat.subCategorias[0].name,function(err,foundSubCat){
                            if(err){
                                callback(err,null);
                            }
                            else{
                                if (foundSubCat!=null){
                                    callback("SubCategory already exists.",null)
                                }
                                else{
                                    foundCat.subCategorias.push(cat.subCategorias[0]);
                                    foundCat.save();
                                    callback(null,foundCat);
                                }
                            }
                        })
                    }
                    
                })
            }
            //se a categoria não existir vai criar
            else{
                Categorias.createCategoria(cat,function(err,newcat){
                    callback(null,newcat)
                })
            }
        }
    })
}

//get sub categoria by name
Categorias.getSubCategoriaByName = function (nameCat,nameSubCat, callback) {
    var query = { name: nameCat};
    
	Categoria.findOne(query, function(err,cat){
        if(err){
            callback(err,null);
        }
        else{
            //Se a categoria nao existir a sub tambem nao vai existir
            if(cat==null){
                callback(null,null);
            }
            else{
                found=null;
                cat.subCategorias.forEach(function(element){
                    if(element.name==nameSubCat){
                        found=element;
                    }
                })
                callback(null,found);
            }
        }
    });
}

//validate sub categoria
Categorias.editSubCategoria = function (newCategoria, callback) {
    
    Categorias.getCategoriaByName(newCategoria.name,async function(err,foundCat){
        if(err){
            callback(err,null);
        } else{
            encontrou=null;
            foundCat.subCategorias.forEach(function(element){
                if(element.name==newCategoria.subCategorias[0].name){
                    encontrou=element;
                }
            })
            if (encontrou!=null){
                try {
                    if (newCategoria.subCategorias[0].desc!=null)
                        encontrou.desc=newCategoria.subCategorias[0].desc;
                    if(newCategoria.subCategorias[0].status!=null)
                        encontrou.status=newCategoria.subCategorias[0].status;
                    await foundCat.save();
                    callback(null,encontrou);
                } catch (error) {
                    callback(err,null);
                }
            }
            else{
                callback("SubCategory does not exist.")
            }
        }
    })
}


//list all subcategorias from categoria
Categorias.getAllSubCategorias = function (cat,filtro,callback){
    Categorias.getCategoriaByName(cat,function(err,foundCat){
        if(err){
            callback(err,null);
        }
        else{
            if(foundCat==null){
                callback("Categoria not found!",null);
                return;
            }
            arr=[]
            foundCat.subCategorias.forEach(function(element){
                if (filtro.status!=null){
                    if(element.status==filtro.status)
                        arr.push(element)
                }
                else{
                    arr.push(element)
                }
            })
            callback(null,arr);
        }
    })
}

//delete sub categoria
Categorias.deleteSubCategoriaByName = function(name,nameSubCat,callback){
    Categorias.getCategoriaByName(name,function(err,foundCat){
        if(err){
            callback(err,null);
        }
        else{
            try {
                newArr=[];
                deleted=null;
                foundCat.subCategorias.forEach(function(element){
                    if(nameSubCat!=element.name){
                        newArr.push(element);
                    }
                    else
                        deleted = element;
                })
                foundCat.subCategorias=newArr;
                foundCat.save();
                callback(null,deleted)
            } catch (error) {
                callback(error,null)
            }
        }
    })
}