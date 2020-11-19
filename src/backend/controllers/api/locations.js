var Location = require('../../models/location');
var mongoose = require('mongoose');
var Locations = module.exports;

Locations.listar = (filtro) => {
    return Location.find(filtro).sort({country : 1, name : 1});
};

Locations.consultar_by_country = (pais) => {
    return Location.find({country : pais}).sort({name : 1});
};

Locations.consultar = (id) => {
    return Location.findOne({ _id: id });
};

Locations.criar = n => {
    n._id = mongoose.Types.ObjectId()
    var newLocation = new Location(n);

    return newLocation.save(); 
}

Locations.update = function(id, novo){
    return Location
        .update({_id : id}, novo, {overwrite: true })
        .exec()
}

Locations.eliminar = function(id, callback){
    Location.findOneAndRemove({_id: id}, function(err, noticia){
        if (err) {	
            callback(err, null);
        } else if(!noticia){
            try{
                id = mongoose.Types.ObjectId(id)
                Location.findOneAndRemove({_id: id}, function(err2, noticia2){
                    if(err2){
                        callback(err2, null);
                    }else{
                        callback(null, noticia2);
                    }
                })
            }catch(e){
                callback("The location does not exist.", null)
            }
        } else {
		    callback(null, noticia);
        }
    });
}

Locations.delete_all_from_country = async function(pais){
    // Apaga todos os registos
    try {
        await new Promise((resolve, reject) => {
            Location.deleteMany({country : pais}, function(err, result) {
                if(err){
                    reject(err)
                }
                else {
                    resolve(result)
                }
            });
        })
    }catch(err){
        throw(`Error while deleting locations associated with country '${pais}'.` );
    }
    return "Locations associated with " + pais + " successfully deleted."
}