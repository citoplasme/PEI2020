var Country = require('../../models/countries');
var mongoose = require('mongoose');
var Countries = module.exports;

Countries.listar = (filtro) => {
    return Country.find(filtro).sort({name : 1});
};

Countries.consultar = (id) => {
    return Country.findOne({ _id: id });
};

Countries.consultar_by_name = (nome) => {
    return Country.find({ name: nome });
};

Countries.criar = n => {
    var obj = {
        _id : mongoose.Types.ObjectId(),
        name : n
    };
    var newCountry = new Country(obj);

    return newCountry.save(); 
}

Countries.update = function(id, nome){
    return Country
        .update({_id : id}, {$set : {name : nome}})
        .exec()
}

Countries.eliminar = function(id, callback){
    Country.findOneAndRemove({_id: id}, function(err, noticia){
        if (err) {	
            callback(err, null);
        } else if(!noticia){
            try{
                id = mongoose.Types.ObjectId(id)
                Country.findOneAndRemove({_id: id}, function(err2, noticia2){
                    if(err2){
                        callback(err2, null);
                    }else{
                        callback(null, noticia2);
                    }
                })
            }catch(e){
                callback("The country does not exist.", null)
            }
        } else {
		    callback(null, noticia);
        }
    });
}