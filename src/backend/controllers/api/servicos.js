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