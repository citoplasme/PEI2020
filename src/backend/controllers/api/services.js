var Service = require('../../models/services');
var mongoose = require('mongoose');
var Services = module.exports;


// GET
Services.listar = (filtro) => {
    return Service.find(filtro);
};

Services.total_services = (idUser) => {
    filtro = (idUser === undefined) ? {} : {$and: [{ $or: [{ client : idUser }, { service_provider : idUser}]}, { status: { $in: [ 2, 3, 4] } }]}
    return Service.find(filtro).countDocuments()
}

Services.services_count_by_status = (idUser) => {
    filtro = (idUser === undefined) ? { $match: {} } : { $match: { service_provider: idUser } }
    return Service.aggregate([filtro, {$group: { _id: "$status", numberOfServices: { $sum: 1 }}}])
}

Services.services_by_status = (idUser) => {
    return Service.find( { $and: [ { service_provider: idUser }, { status: { $in: [ 2, 3, 4] } } ] } )
}

Services.clients_by_service_provider = (idUser) => {
    return Service.find({ $and: [ { service_provider: idUser }, { status: { $in: [ 2, 3, 4] } }] }, {_id: 0, client: 1})
}

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
    // Colocar a undefined o que nao vier no corpo do pedido e assim ao dar set atualizar para undefined os campos
    // Nao pode usar se overwrite pq pode apagar negociação por exemplo
    let upd = {
        client : obj.client,
        service_provider: obj.service_provider, 
        urgent : obj.urgent,
        status : obj.status,
        date : obj.date, 
        hour : obj.hour, 
        duration : obj.duration, 
        desc : obj.desc
    };
    return Service
        .update({_id : id}, {$set : upd})
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

// Date manipulation
Services.date_to_number = function(date_ob){
	// adjust 0 before single digit date
	let date = ("0" + date_ob.getDate()).slice(-2);

	// current month
	let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

	// current year
	let year = date_ob.getFullYear();

	// current hours
	let hours = date_ob.getHours();

	// current minutes
	let minutes = date_ob.getMinutes();

	// YYYYMMDDHHmm
	return minutes + hours * 100 + date * 10000 + month * 1000000 + year * 100000000;
}


// >= 24
Services.date_difference = function(data, horario){
	if(data === undefined){
		return -1;
	} else if (horario === undefined){
		horario = "00:00:00";
	} else {
		horario = horario + ":00";
	}
	let marcacao = new Date(data + "T" + horario + "Z");

	// current date
	let date_ob = new Date();

	//return Services.date_to_number(marcacao) - Services.date_to_number(date_ob); 
    return (marcacao - date_ob) / 36e5; // 60 * 60 * 1000
}