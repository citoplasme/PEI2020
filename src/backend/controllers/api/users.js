var User = require('../../models/user');
var AuthCall = require('../../models/auth');
var bcrypt = require('bcryptjs');
var xml2js = require('xml2js');
var mongoose = require('mongoose');
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
    if(req.query.entidade!=undefined)
    filtro = {entidade: req.query.entidade};
    
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
                            item["level"] = 'Validator - level 2';
                            break;
                        case 3.5:
                            item["level"] = 'Validator - level 1';
                            break;
                        case 3:
                            item["level"] = 'Advanced user';
                            break;
                        case 2:
                            item["level"] = 'Basic user - level 2';
                            break;
                        case 1:
                            item["level"] = 'Basic user - Level 1';
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


Users.adicionarCategoria = function(id, categoria, callback) {
    // TODO :
}

Users.adicionarCategorias = function(id, categorias, callback) {
    // TODO :
}

Users.adicionarSubCategoria = function(id, subcategoria, callback) {
    // TODO :
}

Users.adicionarSubCategorias = function(id, subcategorias, callback) {
    // TODO :
}

Users.incrementarServicosRealizados = function(id, callback) {
    // TODO :   
}

Users.atualizarKarma = function(id, callback) {
    // TODO :
}

Users.atualizarTermsOfService = function(id, accepted, callback) {
    // TODO :
}
