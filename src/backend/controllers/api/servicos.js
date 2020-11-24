var Service = require('../../models/servicos');
var mongoose = require('mongoose');
var Services = module.exports;


// GET
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


// POST
Services.criar = n => {
    n._id = mongoose.Types.ObjectId();
    n.review = {
        client: {},
        service_provider: {}
    };
    var newService = new Service(n);
    return newService.save(); 
}

// PUT
Services.update = function(id, obj){
    id = mongoose.Types.ObjectId(id);
    return Service
        .update({_id : id}, {$set : obj})
        //.update({_id : id}, obj, {overwrite : true})
        .exec()
}

Services.update_bid = function(id, value, user){
    var bid = {
        user : user,
        value : value
    };
    id = mongoose.Types.ObjectId(id);
    return Service
        .update({_id : id}, {$push : { orcamento : bid}})
        .exec()
}

Services.update_fatura = function(id, fatura){
    id = mongoose.Types.ObjectId(id);
    return Service
        .update({_id : id}, {$set : { fatura : fatura}})
        .exec()
}

Services.update_review_from_client = function(id, review){
    id = mongoose.Types.ObjectId(id);
    return Service
        .update({_id : id}, {$set : { "review.service_provider" : review}})
        .exec()
}

Services.update_review_from_service_provider = function(id, review){
    id = mongoose.Types.ObjectId(id);
    return Service
        .update({_id : id}, {$set : { "review.client" : review}})
        .exec()
}

Services.update_status = function(id, status){
    id = mongoose.Types.ObjectId(id);
    return Service
        .update({_id : id}, {$set : { status : status}})
        .exec()
}

// DELETE
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

// KARMA
Services.calculate_karma_client = function(obj){
    var val = obj.ponctuality * 0.1 + obj.quality * 0.2 + obj.security * 0.2 + obj.attendance * 0.1 + obj.general * 0.4;
    return val;
}

Services.calculate_karma_service_provider = function(obj){
    var val = obj.ponctuality * 0.1 + obj.payment * 0.3 + obj.security * 0.2 + obj.general * 0.4;
    return val;
}