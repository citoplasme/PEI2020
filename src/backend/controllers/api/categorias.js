var Category = require('../../models/categorias');
var mongoose = require('mongoose');
var Categories = module.exports;

Categories.listar = (filtro) => {
    return Category.find(filtro).sort({name : 1});
};

Categories.consultar = (id) => {
    return Category.findOne({ _id: id });
};

Categories.consultar_by_name = (nome) => {
    return Category.find({ name: nome });
};

Categories.criar = n => {
    n._id = mongoose.Types.ObjectId();
    var newCategory = new Category(n);

    return newCategory.save(); 
}

Categories.update = function(id, obj){
    return Category
        .update({_id : id}, obj, {overwrite : true})
        .exec()
}

Categories.eliminar = function(id, callback){
    Category.findOneAndRemove({_id: id}, function(err, noticia){
        if (err) {	
            callback(err, null);
        } else if(!noticia){
            try{
                id = mongoose.Types.ObjectId(id)
                Category.findOneAndRemove({_id: id}, function(err2, noticia2){
                    if(err2){
                        callback(err2, null);
                    }else{
                        callback(null, noticia2);
                    }
                })
            }catch(e){
                callback("The category does not exist.", null)
            }
        } else {
		    callback(null, noticia);
        }
    });
}