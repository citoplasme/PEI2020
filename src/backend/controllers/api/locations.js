var Location = require('../../models/location');
var mongoose = require('mongoose');
var Locations = module.exports;

Locations.listar = (filtro) => {
    return Location.find(filtro).sort({country : 1});
};

Locations.listarCountries = () => {
    return Location.find({}, {country : 1}).sort({country : 1});
};

Locations.consultar = (id) => {
    return Location.findOne({ _id: id });
};

Locations.criar = n => {
    n._id = mongoose.Types.ObjectId()
    var newLocation = new Location(n);

    return newLocation.save(); 
}