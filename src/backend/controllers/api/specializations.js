var Specialization = require('../../models/specializations');
var mongoose = require('mongoose');
var Specializations = module.exports;

Specializations.listar = (filtro) => {
    return Specialization.find(filtro).sort({category : 1, name : 1});
};

Specializations.consultar_by_category = (pais) => {
    return Specialization.find({category : pais}).sort({name : 1});
};

Specializations.consultar = (id) => {
    return Specialization.findOne({ _id: id });
};

Specializations.criar = n => {
    n._id = mongoose.Types.ObjectId()
    var newSpec = new Specialization(n);

    return newSpec.save(); 
}

Specializations.update = function(id, novo){
    return Specialization
        .update({_id : id}, novo, {overwrite: true })
        .exec()
}

Specializations.eliminar = function(id, callback){
    Specialization.findOneAndRemove({_id: id}, function(err, noticia){
        if (err) {	
            callback(err, null);
        } else if(!noticia){
            try{
                id = mongoose.Types.ObjectId(id)
                Specialization.findOneAndRemove({_id: id}, function(err2, noticia2){
                    if(err2){
                        callback(err2, null);
                    }else{
                        callback(null, noticia2);
                    }
                })
            }catch(e){
                callback("The specialization does not exist.", null)
            }
        } else {
		    callback(null, noticia);
        }
    });
}

Specializations.delete_all_from_category = async function(pais){
    // Apaga todos os registos
    try {
        await new Promise((resolve, reject) => {
            Specialization.deleteMany({category : pais}, function(err, result) {
                if(err){
                    reject(err)
                }
                else {
                    resolve(result)
                }
            });
        })
    }catch(err){
        throw(`Error while deleting specializations associated with category '${pais}'.` );
    }
    return "Specializations associated with " + pais + " successfully deleted."
}