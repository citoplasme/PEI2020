var express = require('express');
var Logging = require('../../controllers/logging');
var router = express.Router();
var passport = require('passport');
var User = require('../../models/user');
var Users = require('../../controllers/api/users');
var AuthCalls = require('../../controllers/api/auth');
var Auth = require('../../controllers/auth');
var jwt = require('jsonwebtoken');
var secretKey = require('./../../config/app');
var Mailer = require('../../controllers/api/mailer');
var mongoose = require('mongoose');

// Para a foto (upload de ficheiros)
var formidable = require("formidable")
var ncp = require('ncp').ncp;
ncp.limit = 16;
var fs = require('fs')

router.get('/', Auth.isLoggedInUser, Auth.checkLevel(5), (req, res) => {
    Users.listar(req,function(err, result){
        if(err){
            //res.status(500).send(`Erro: ${err}`);
            res.status(500).send("Error while listing the users.");
        }else{
            res.json(result);
        }
    });
});

router.get('/:id/token', Auth.isLoggedInUser, async function(req,res){
    await jwt.verify(req.params.id, secretKey.userKey, async function(err, decoded){
        if(!err){
            if(decoded.id == req.user.id || req.user.level == 7){
                await Users.listarPorId(decoded.id, function(err, result){
                    if(err){
                        //res.status(500).send(err);
                        res.status(500).send("Error while getting the user.");
                    }else{
                        result._doc.local = result._doc.local.password ? true : false
                        res.send(result);
                    }
                });
            }else{
                //Não tem permissões para aceder à informação de outro utilizador
                res.status(403).send("Access level is not high enough to access that information.")
            }
        }else{
            //res.status(403).send(err);
            res.status(500).send("It was not possible to get the user.");
        }
    });
});

router.get('/token', Auth.isLoggedInUser, async function(req,res){
    res.send(req.user);
});

router.post('/registar', function (req, res) {
    var internal = (req.body.type > 1);
    var newUser = new User({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        internal: internal,
        level: 1,
        local: {
            password: req.body.password
        },
        favorites: []
    });
    
    Users.getUserByEmail(req.body.email, async function (err, user) {
        if (err) {
            //return res.status(500).send(`Erro: ${err}`);
            return res.status(500).send('It was not possible to register the user. Please check if the values are correct or if something is missing.');
        }

        if (!user) {
            await Users.createUser(newUser, function (err, user) {
                if (err) {
                    //return res.status(500).send(`Erro: ${err}`);
                    return res.status(500).send('It was not possible to register the user. Please check if the values are correct or if something is missing.');
                }
            });
            res.send('User registered with success.');
        } else {
            res.status(500).send('It was not possible to register the user: the email is already in use.');
        }
    });
});

router.post("/login", (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
        if (err)
            //res.status(500).send(err)
            res.status(500).send("Authentication failed.")
        if (!user)
            res.status(401).send('Invalid credentials.')
        else{
            req.login(user, () => {
                var token = Auth.generateTokenUser(user);

                res.send({
                    token: token, 
                    name : user.name
                })
            })
        }
    })(req, res, next);
});

router.post('/recuperar', function (req, res) {
    Users.getUserByEmail(req.body.email, function (err, user) {
        if (err) {
            //return res.status(500).send(`Erro: ${err}`);
            return res.status(500).send("Account recovery failed.");
        } else if (!user){
            //Não existe nenhum utilizador registado com esse email
            //Por forma a não divulgar que emails estão já usados, será devolvido que foi enviado um email com sucesso
            res.send('Email successfully sent.');
        } else {
            Users.getUserById(user._id, function(err, user){
                if(err) 
                    //return res.status(500).send(`Erro: ${err}`);
                    return res.status(500).send("Account recovery failed.");
                if(user.local.password != undefined){
                    var token = Auth.generateTokenUserRecuperar(user);
                    Mailer.sendEmailRecuperacao(req.body.email, req.body.url.split('/recuperacao')[0]+'/alteracaoPasswordRecuperacao?jwt='+token);
                    res.send('Email successfully sent.')
                }else{
                    //Este utilizador foi registado na plataforma CLAV através do Cartão de Cidadão, não existindo uma password para o mesmo
                    //Por forma a não divulgar que emails estão já usados, será devolvido que foi enviado um email com sucesso
                    res.send('Email successfully sent.');
                }
            })
        }
    });
});

router.put('/:id/desativar', Auth.isLoggedInUser, Auth.checkLevel(5), async function(req, res) {
    if(req.user.id != req.params.id){
        Users.desativar(req.params.id, function(err, user){
            if(err){
                //res.status(500).send(`Erro: ${err}`);
                res.status(500).send("It was not possible to deactivate the user.");
            }else{
                res.send('User deactivated with success.');
            }
        })
    }else{
        res.status(500).send('You cannot deactivate yourself.');
    }
});

router.delete('/:id', Auth.isLoggedInUser, Auth.checkLevel(7), async function(req, res) {
    if(req.user.id != req.params.id){
        Users.eliminar(req.params.id, function(err, user){
            if(err){
                //res.status(500).send(`Erro: ${err}`);
                res.status(500).send("It was not possible to delete the user.");
            }else{
                res.send('User deleted with success.');
            }
        })
    }else{
        res.status(500).send('You cannot delete yourself.');
    }
});

//Funcoes de alteracao de utilizador
router.put('/:id/password', Auth.isLoggedInUser, function (req, res) {
    if(req.user.level >= 6){
        //Se enviou a password atual e é a sua conta
        if(req.body.atualPassword && req.body.novaPassword && req.params.id == req.user.id){
            Users.getUserById(req.params.id, function(err, user) {
                if(err) {
                    //return res.status(500).send(`Erro: ${err}`);
                    return res.status(500).send("It was not possible to update the password.");
                }

                if(user.local.password != undefined){
                    Users.atualizarPasswordComVerificacao(req.params.id, req.body.atualPassword, req.body.novaPassword, function (err, cb) {
                        if (err) {
                            //res.status(500).send(`Erro: ${err}`);
                            res.status(500).send("It was not possible to update the password.");
                        } else res.send('Password updated with success.')
                    });
                }else{
                    Users.atualizarPassword(req.params.id, req.body.novaPassword, function (err, cb) {
                        if (err) {
                            //res.status(500).send(`Erro: ${err}`);
                            res.status(500).send("It was not possible to update the password.");
                        } else res.send('Password updated with success.')
                    });
                }
            })
        //se não enviou a password atual ou não é a sua conta
        }else if(req.body.novaPassword){
            Users.atualizarPassword(req.params.id, req.body.novaPassword, function (err, cb) {
                if (err) {
                    //res.status(500).send(`Erro: ${err}`);
                    res.status(500).send("It was not possible to update the password.");
                } else res.send('Password updated with success.')
            });
        }else{
            res.status(500).send("Error: missing fields.")
        }
    }else if(req.params.id == req.user.id){
        //Utilizador a recuperar a conta
        if(req.user.level == 0 && req.body.novaPassword){
            Users.atualizarPassword(req.params.id, req.body.novaPassword, function (err, cb) {
                if (err) {
                    //res.status(500).send(`Erro: ${err}`);
                    res.status(500).send("It was not possible to update the password.");
                } else res.send('Password updated with success.')
            });
        } else {
            Users.getUserById(req.params.id, function(err, user) {
                if(err) {
                    //return res.status(500).send(`Erro: ${err}`);
                    return res.status(500).send("It was not possible to update the password.");
                }

                if(user.local.password != undefined){
                    if(req.body.atualPassword && req.body.novaPassword){
                        Users.atualizarPasswordComVerificacao(req.params.id, req.body.atualPassword, req.body.novaPassword, function (err, cb) {
                            if (err) {
                                //res.status(500).send(`Erro: ${err}`);
                                res.status(500).send("It was not possible to update the password.");
                            } else res.send('Password updated with sucess.')
                        });
                    }else{
                        res.status(500).send("Error: missing fields.")
                    }
                }else{
                    if (req.body.novaPassword){
                        Users.atualizarPassword(req.params.id, req.body.novaPassword, function (err, cb) {
                            if (err) {
                                //res.status(500).send(`Erro: ${err}`);
                                res.status(500).send("It was not possible to update the password.");
                            } else res.send('Password updated with sucess.')
                        });
                    }else{
                        res.status(500).send("Error: missing fields.")
                    }
                }
            })
        }
    }else{
        //Não tem permissões para alterar a password de outro utilizador
        res.status(403).send("Your level is not high enough.")
    }
});

/* Adicionar campos das categorias e subcategorias? */
router.put('/:id', Auth.isLoggedInUser, Auth.checkLevel(5), function (req, res) {
    Users.getUserByEmail(req.body.email, function(err,user){
        if(user && req.params.id != user._id){
            res.status(500).send('It was not possible to update the user. The email is already in use.');
        }else{
            Users.atualizarMultiplosCampos(req.params.id, req.body.nome, req.body.email, req.body.level, function (err, cb) {
                if (err) { 
                    //res.status(500).send(`Erro: ${err}`);
                    res.status(500).send('It was not possible to update the user. Please verify if all the fields are filled.');
                } else {
                    res.send('User updated with success.')
                }
            });
        }
    });
});

router.get('/:id', Auth.isLoggedInUser, (req, res) => {
    if(req.params.id == req.user.id || req.user.level >= 5){
        Users.listarPorId(req.params.id,function(err, result){
            if(err){
                //res.status(500).send(`Erro: ${err}`);
                res.status(500).send("It was not possible to obtain the user.");
            }else{
                result._doc.local = result._doc.local.password ? true : false
                res.json(result);
            }
        });
    }else{
        //Não tem permissões para aceder à informação de outro utilizador
        res.status(403).send("Your level is not high enough.")
    }
});

//-------------------------------------------------------------------------------------

/* Ver categorias */
router.get('/:id/categorias', (req, res) => {
        Users.listarPorId(req.params.id,function(err, result){
            if(err){
                res.status(500).send("It was not possible to obtain categories.");
            }else{
                res.json(result.categorias);
            }
        });
});

/* Ver subcategorias */
router.get('/:id/subCategorias', (req, res) => {
        Users.listarPorId(req.params.id,function(err, result){
            if(err){
                res.status(500).send("It was not possible to obtain subcategories.");
            }else{
                res.json(result.subcategorias);
            }
        });
});
//-------------------------------------------------------------------------------------

router.put('/:id/categorias', Auth.isLoggedInUser, Auth.checkLevel(3), async function(req, res) {
    Users.adicionarCategorias(req.params.id, req.body.categorias,function(err, user){
        if(err){
            res.status(500).send(err);
        }else{
            res.send('Categories successfully assigned.');
        }
    })
});

/* Pode adicionar subcategoria mesmo que nao tenha a categoria geral nas suas categorias? */
router.put('/:id/subCategorias', Auth.isLoggedInUser, Auth.checkLevel(3), async function(req, res) {
    Users.adicionarSubCategorias(req.params.id, req.body.subcategorias,function(err, user){
        if(err){
            res.status(500).send(err);
        }else{
            res.send('Subcategories successfully assigned.');
        }
    })
});

router.put('/:id/updateToS', Auth.isLoggedInUser, async function(req, res) {
    Users.atualizarTermsOfService(req.params.id,function(err, user){
        if(err){
            res.status(500).send(err);
        }else{
            res.send('Terms of Service agreement updated successfully.');
        }
    })
});

router.put('/:id/uploadphoto', Auth.isLoggedInUser, async function(req, res) {
    
    var form = new formidable.IncomingForm()
    form.parse(req, async (error, fields, formData) => {
        if(!error){
            // Verify the existence of the file
            if(formData.file && formData.file.type && formData.file.path){
                // Verify if the file is a PDF
                if(formData.file.type === "image/png" || formData.file.type === "image/jpg" || formData.file.type === "image/jpeg"){
                    // Check if the photo is for the logged user
                    if(req.params.id == req.user.id) {

                        const contents = fs.readFileSync(formData.file.path, {encoding: 'base64'});
                        
                        Users.savePhoto(req.params.id, contents, formData.file.type.split("/")[1], function(err, user) {
                            if(err) {
                                res.status(500).send(err);
                            }
                            else {
                                res.send('Photo uploaded successfully.')
                            }
                        });
                    } 
                    else{
                        res.status(403).send("Unable to upload photo for an user other than you.")
                    } 
                } 
                else {
                    res.status(500).json(`Error while uploading photo: the extension has to be PNG, JPEG or JPG.`)
                }
            } else {
                res.status(500).json(`Error while uploading photo: the photo was not sent.`)
            }
        }
        else {
            res.status(500).json(`Error while uploading photo: ${error}`)
        }
    }) 
});

router.delete('/:id/removephoto', Auth.isLoggedInUser, async function(req, res) {
    if(req.params.id == req.user.id || req.user.level >= 5) {
        Users.removePhoto(req.params.id, function(err, user) {
            if(err) {
                res.status(500).send(err);
            }
            else {
                res.send('Photo removed successfully.')
            }
        });
    } else{
        res.status(403).send("Unable to upload photo for an user other than you.")
    }
});

module.exports = router;
