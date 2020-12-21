var User = require('../../models/user');
var AuthCall = require('../../models/auth');
var bcrypt = require('bcryptjs');
var xml2js = require('xml2js');
var mongoose = require('mongoose');
const { cli } = require('winston');
const request = require('../../controllers/api/utils').request
const salt = 14

var Users = module.exports

Users.createUser = function (newUser, callback) {
	bcrypt.genSalt(salt, function (err, salt) {
		bcrypt.hash(newUser.local.password, salt, async function (err, hash) {
			newUser.local.password = hash;
            try{
			    newUser = await newUser.save()
                callback(null, newUser)
            }catch(err){
                callback(err, null)
            }
		});
	});
}

Users.categories_by_service_provider = () => {
    return User.aggregate([{$unwind: "$categorias"}, {$project:{name: "$categorias", user:{userId: "$_id"}}}, {$group:{_id:"$name", users:{$push:"$user"}}}, {$project: {nUsers: { $size: "$users" }}}])
}

Users.specializations_by_service_provider = () => {
    return User.aggregate([{$unwind: "$subcategorias"}, {$project:{name: "$subcategorias", user:{userId: "$_id"}}}, {$group:{_id:"$name", users:{$push:"$user"}}}, {$project: {nUsers: { $size: "$users" }}}])
}

//GET Get total of users grouped by type(client, service_provider, admin)
Users.total_users_by_level = () => {
    return User.aggregate( [ {
        $facet: {
            "clients": [ { $group: { _id: { $in: [ "$level", [ 1, 2 ] ] }, total: {$sum: 1 } } } ],
            "service_providers": [ { $group: { _id: { $in: [ "$level", [ 3, 3.5, 4 ] ] }, total: { $sum: 1 } } } ],
            "admins": [ { $group: { _id: { $in: [ "$level", [ 5, 6, 7 ] ] }, total: { $sum: 1 } } } ]
        }
    } ] )
}

Users.getUserByEmail = function (email, callback) {
	var query = { email: email };
	User.findOne(query, callback);
}

Users.getUserByCC = function (nic, callback) {
	var query = { _id: nic};
	User.findOne(query, callback);
}

Users.getUserById = function (id, callback) {
	Users.getUserByCC(id, function(err, user1){
        if(err || !user1){
            try{
                id = mongoose.Types.ObjectId(id)
                Users.getUserById(id, function(err, user2){
                    if(err || !user2){
                        callback(err, null);
                    }else{
                        callback(null, user2);
                    }
                })
            }catch(e){
                callback("User does not exist.", null)
            }
        }else{
            callback(null, user1);
        }
    });
}

Users.comparePassword = function (candidatePassword, hash, callback) {
	bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
		callback(null, isMatch);
	});
}

Users.listar = function(req, callback){
    var filtro = {}
    
    User.find(filtro, function(err,users){
        if(err){
            callback(err, null)
        }else{
            if(req.query.formato=='normalizado'){
                listaNormalizada = [];
                for(var i = 0; i < users.length; i++) {
                    item = {}
                    item["name"] = users[i].name;
                    switch(users[i].level) {
                        case 7:
                            item["level"] = 'Technological Administrator';
                            break;
                        case 6:
                            item["level"] = 'Functional Administrator';
                            break;
                        case 5:
                            item["level"] = 'Decision maker';
                            break;
                        case 4:
                            item["level"] = 'Premium service provider';
                            break;
                        case 3.5:
                            item["level"] = 'Verified service provider';
                            break;
                        case 3:
                            item["level"] = 'Service provider';
                            break;
                        case 2:
                            item["level"] = 'Premium user';
                            break;
                        case 1:
                            item["level"] = 'Regular user';
                            break;
                        case -1:
                            item["level"] = 'Deactivated user';
                            break;
                    }
                    item["email"] = users[i].email;
                    item["id"] = users[i]._id;
                    listaNormalizada.push(item);
                }
                callback(null, listaNormalizada);
            }else{
                users.map(u => delete u._doc.local);
                callback(null, users);
            }
        }
    })
}

Users.list_service_providers = function(filtro, callback){
    filtro = filtro === undefined ? {} : filtro;

    // Check if exists and its an array (if is one element, mongo knows what to do)
    if(filtro.categorias && filtro.categorias.length > 1){
        filtro.categorias = {
            $all: filtro.categorias
        };
    }

    // Check if exists and its an array (if is one element, mongo knows what to do)
    if(filtro.subcategorias && filtro.subcategorias.length > 1){
        filtro.subcategorias = {
            $all: filtro.subcategorias
        };
    }

    // Check if exists and its an array (if is one element, mongo knows what to do)
    if(filtro.locations && filtro.locations.length > 1){
        filtro.locations = {
            $all: filtro.locations
        };
    }

    filtro.level = {$gte : 3, $lte : 4};
    
    // console.log(JSON.stringify(filtro, null, 2))

    User.find(filtro).sort({level : -1, karma : -1}).exec(function(err,users){
        if(err){
            callback(err, null)
        }else{
            users = users.map(u => {
                let obj = {
                    email: u.email,
                    name: u.name,
                    categorias: u.categorias,
                    subcategorias: u.subcategorias,
                    servicos_realizados: u.servicos_realizados,
                    karma: u.karma,
                    locations: u.locations,
                    _id: u._id,
                    level: u.level,
                    photo: u.photo
                };
                return obj;
            });
            callback(null, users);
        }
    })
}


Users.listarPorId = function(id, callback){
    Users.getUserById(id, function(err, user){
        if(err){
            callback(err, null);
        }else{
            callback(null, user);
        }
    });
}

Users.atualizarMultiplosCampos = function(id, nome, email, level, callback){
    Users.getUserById(id, async function(err, user){
		if (err) {	
            callback(err, null);
		} else {
            // console.log(user)
            user.name = nome;
            user.email = email;
            user.level = level;
            try{
                user = await user.save()
                callback(null, user);
            }catch(err){
		        callback(err, null);
            }
        }
    });
}

Users.atualizarPassword = function(id, password, callback){
    Users.getUserById(id, function(err, user){
		if (err) {
            callback(err, null);
		} else {
            bcrypt.genSalt(salt, function (err, salt) {
                bcrypt.hash(password, salt, async function (err, hash) {
                    user.local.password = hash;
                    try{
                        user = await user.save()
                        callback(null, user)
                    }catch(err){
                        callback(err, null)
                    }
                });
            });
        }
    });
}

Users.atualizarPasswordComVerificacao = function(id, atualPassword, novaPassword, callback){
    Users.getUserById(id, function(err, user){
		if (err) {
            callback(err, null);
		} else {
            Users.comparePassword(atualPassword, user.local.password, function(err, isMatch) {
                if (err) {
                    callback(err, null);
                }else{
                    if(isMatch){
                        bcrypt.genSalt(salt, function (err, salt) {
                            bcrypt.hash(novaPassword, salt, async function (err, hash) {
                                user.local.password = hash;
                                try{
                                    user = await user.save()
                                    callback(null, user)
                                }catch(err){
                                    callback(err, null)
                                }
                            });
                        });
                    }else{
                        callback("Invalid credentials", null)
                    }
                }
            })
        }
    });
}

Users.desativar = function(id, callback){
    Users.getUserById(id, async function(err, user){
        if (err) {	
            callback(err,null)
        } else {
            user.level = -1;
            try{
                user = await user.save()
                callback(null, user)
            }catch(err){
                callback(err, null)
            }
        }
    });
}

Users.eliminar = function(id, callback){
    User.findOneAndRemove({_id: id}, function(err, user){
        if (err) {	
            callback(err, null);
        } else if(!user){
            try{
                id = mongoose.Types.ObjectId(id)
                User.findOneAndRemove({_id: id}, function(err2, user2){
                    if(err2){
                        callback(err2, null);
                    }else{
                        callback(null, user2);
                    }
                })
            }catch(e){
                callback("User does not exist", null)
            }
        } else {
		    callback(null, user);
        }
    });
}

Users.listarEmail = function(id, callback){
    Users.getUserById(id, function(err, user){
        if (err) {
            callback(err, null);
        }else{
            callback(null, user.email);
        };
    })
}

Users.adicionarChamadaApi = function(id, callback){
    User.findOneAndUpdate({_id: id}, {$inc: {nCalls: 1}}, {useFindAndModify: false}, function(err, user){
        if (err) {	
            callback(err,null)
        } else {
            user.nCalls++;
		    callback(null, user);
        }
    });
}

Users.updateCategories = function(id, categorias, updatedSubcategorias,callback) {
    Users.getUserById(id, async function(err,user){
        if(err) {
            callback(err,null);
        }
        else {
            user.categorias = categorias;
            user.subcategorias = updatedSubcategorias;
            try{
                user = await user.save()
                callback(null, user)
            }catch(err){
                callback(err, null)
            }
        }
    });
}

Users.updateSpecializations = function(id, specializations, categories, callback) {
    Users.getUserById(id, async function(err,user){
        if(err) {
            callback(err,null);
        }
        else {
            user.subcategorias = specializations;
            user.categorias = categories
            try{
                user = await user.save()
                callback(null, user)
            }catch(err){
                callback(err, null)
            }
        }
    });
}

Users.updateLocations = function(id, locations, callback) {
    Users.getUserById(id, async function(err, user){
        if (err) {
            callback(err,null);
        }
        else {
            user.locations = locations;
            try {
                user = await user.save()
                callback(null, user)
            }
            catch(err){
                callback(err, null)
            }
        }
    });
}

Users.incrementarServicosRealizados = function(id, callback) {
    User.findOneAndUpdate({_id: id}, {$inc: {servicos_realizados: 1}}, {useFindAndModify: false}, function(err, user){
        if (err) {	
            callback(err,null)
        } else {
            user.servicos_realizados++;
		    callback(null, user);
        }
    });   
}

/* toggle ao boolean para poder ser usado para por a falso tambem ? */
Users.updateTermsOfService = function(id, callback) {
    Users.getUserById(id, async function(err, user){
        if (err) {	
            callback(err,null)
        } else {
            user.termsofservice = !user.termsofservice;
            try {
                user.save();
                callback(null,user);
            }
            catch(err) {
                callback(err, null);
            }
        }
    });
}   

/* Passa termsOfService de todos a falso */
Users.uncheckTermsOfService = function(callback) {
    try {
        var x = User.updateMany({"level": {$lt:4}},{$set: {"termsofservice" : false}})
        callback(null,x)
    }
    catch (err) {
        callback(err,null)
    }
    
}

Users.savePhoto = function(id, photo, extension, callback) {
    Users.getUserById(id, async function(err, user) {
        if (err) {
            callback(err, null)
        }
        else {
            user.photo.content = photo;
            user.photo.extension = extension
            try {
                user.save();
                callback(null,user);
            }
            catch(err) {
                callback(err, null);
            }
        }
    });
}

Users.removePhoto = function(id, callback) {
    Users.getUserById(id, async function(err, user) {
        if (err) {
            callback(err, null)
        }
        else {
            if (user.photo) {
                user.photo = undefined;
                try {
                    user.save();
                    callback(null,user);
                }
                catch(err) {
                    callback(err, null);
                }
            }
            else {
                callback('There is no uploaded photo.', null)
            }
        }
    });
}


Users.update_karma_and_nservices = function(client, review_client, service_provider, review_service_provider, callback){
    try{
        // Update karma and Num serv client
        let cli = mongoose.Types.ObjectId(client);
        User.findOneAndUpdate(
            {
                _id: cli
            }, 
            {$inc: 
                {
                    karma: review_client, 
                    servicos_realizados : 1
                }
            }
        ).exec();
        // Update karma and Num serv service provider
        let ser = mongoose.Types.ObjectId(service_provider);
        User.findOneAndUpdate(
            {
                _id: ser
            }, 
            {$inc: 
                {
                    karma: review_service_provider, 
                    servicos_realizados : 1
                }
            }
        ).exec();
        callback(null, "DONE")
    }
    catch(e){
        callback(e, null)
    }
}

Users.consultar = (id) => {
    id = mongoose.Types.ObjectId(id);
    return User.findOne({ _id: id });
};

Users.update_level = function(id, level){
    id = mongoose.Types.ObjectId(id);
    return User
        .update({_id : id}, {$set : { level : level}})
        .exec()
}