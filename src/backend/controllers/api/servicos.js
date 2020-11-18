var Service = require('../../models/servicos');
var mongoose = require('mongoose');
var Services = module.exports;

Services.listar = (filtro) => {
    return Service.find(filtro);
};

Services.listar_from_user = (filtro, user) => {
    filtro = filtro === undefined ? {} : filtro;
    filtro.$or = [{ client : user }, { service_provider : user}];
    return Service.find(filtro);
};

Services.consultar = (id) => {
    id = mongoose.Types.ObjectId(id);
    return Service.findOne({ _id: id });
};

Services.consultar_from_user = (id, user) => {
    id = mongoose.Types.ObjectId(id);
    return Service.findOne({ _id: id, $or:[{ client : user }, { service_provider : user}]});
};

Services.criar = n => {
    n._id = mongoose.Types.ObjectId();
    var newService = new Service(n);
    return newService.save(); 
}

Services.eliminar = function(id, callback){
    Service.findOneAndRemove({_id: id}, function(err, noticia){
        if (err) {	
            callback(err, null);
        } else if(!noticia){
            try{
                id = mongoose.Types.ObjectId(id)
                Service.findOneAndRemove({_id: id}, function(err2, noticia2){
                    if(err2){
                        callback(err2, null);
                    }else{
                        callback(null, noticia2);
                    }
                })
            }catch(e){
                callback("The service does not exist.", null)
            }
        } else {
		    callback(null, noticia);
        }
    });
}