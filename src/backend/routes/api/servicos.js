var Auth = require('../../controllers/auth.js');
var express = require('express');
var router = express.Router();
var Services = require('../../controllers/api/servicos.js');
var Users = require('../../controllers/api/users.js');
var url = require('url')
var validKeys = ["client", "service_provider", "urgent", "status", "date", "hour", "duration"];
const { validationResult } = require('express-validator');
const { existe, eMongoId, dataValida, horaValida, vcServiceStatus, estaEm } = require('../validation')


// VER NIVEIS DE ACESSO -> Verificar que user e um dos intervenientes ou é admin

// GET /services 
router.get('/', Auth.isLoggedInUser, [
    existe("query", "client").optional(),
    existe("query", "service_provider").optional(),
    existe("query", "urgent").optional(),
    existe("query", "date").optional(),
    existe("query", "hour").optional(),
    existe("query", "duration").optional()
], async function (req, res) {
    
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).jsonp(errors.array())
    }

    var queryData = url.parse(req.url, true).query;
    
    var filtro = Object.entries(queryData)
        .filter(([k, v]) => validKeys.includes(k))

    filtro = Object.assign({}, ...Array.from(filtro, ([k, v]) => ({[k]: v}) ));
    
    // In case its an admin, every data item should be available
    if(req.user.level >= 6){
        Services.listar(filtro)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).send(`Error while listing the services: ${erro}`))
    }
    // Otherwise, the user should only be capable of seeing services that he is part on
    else {
        Services.listar_from_user(req.params.id, req.user.id)
            .then(dados => res.jsonp(dados))
	        .catch(erro => res.status(500).send(`Error while listing the services: ${erro}`))
    }
})

// GET /:id
router.get('/:id', Auth.isLoggedInUser, [
    eMongoId('param', 'id')
], (req, res) => {
    
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).jsonp(errors.array())
    }
    
    // In case its an admin, every data item should be available
    if(req.user.level >= 6){
        Services.consultar(req.params.id)
            .then(dados => dados ? res.jsonp(dados) : res.status(404).send(`Error: The data item with identified by '${req.params.id}' does not exist on the services.`))
	        .catch(erro => res.status(500).send(`Error while listing the service with identifier '${req.params.id}': ${erro}`))
    } 
    // Otherwise, the user should only be capable of seeing services that he is part on
    else {
        Services.consultar_from_user(req.params.id, req.user.id)
            .then(dados => dados ? res.jsonp(dados) : res.status(404).send(`Error: The data item with identified by '${req.params.id}' does not exist on the services.`))
	        .catch(erro => res.status(500).send(`Error while listing the service with identifier '${req.params.id}': ${erro}`))
    }
})

/* 
Status: 
-2 - Recused
-1 - Canceled
0 - Generated
1 - Negotiating
2 - Accepted
3 - Waiting for evaluation
4 - Finalized
*/

// POST /
router.post('/', Auth.isLoggedInUser, Auth.checkLevel([1, 2, 3, 3.5, 4, 5, 6, 7]), [
    existe("body", "client"),
    existe("body", "service_provider").optional(),
    existe("body", "urgent"),
    estaEm('body', 'status', vcServiceStatus), //existe("body", "status"), // VALIDAR STATUS
    dataValida("body", "date").optional(), 
    horaValida("body", "hour").optional(), 
    existe("body", "duration").optional(),
], async function (req, res) {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).jsonp(errors.array())
    }

    // Admins can manipulate the DB as they please
    else if(req.user.level >= 6){
        Services.criar(req.body)
            .then(dados => {
                if(dados) res.jsonp("Service successfully added to the database.")
                else res.status(500).jsonp("Error creating the service.")
            })
            .catch(erro => res.status(500).jsonp("Error creating the service: " + erro))
    }
    // User has to be a part of the service. Either the client or the service_provider
    else {
        // Urgent service request not associated with any service provider (optional) 
        if(req.body.service_provider === undefined){
            // Client creates a service for himself
            if(req.user.id === req.body.client){
                Services.criar(req.body)
                    .then(dados => {
                        if(dados) res.jsonp("Service successfully added to the database.")
                        else res.status(500).jsonp("Error creating the service.")
                    })
                    .catch(erro => res.status(500).jsonp("Error creating the service: " + erro))
            }
            // Client is not creating a service for himself
            else {
                res.status(500).jsonp("Error creating the service: you are not part of the service that you want to create.")
            }
        }
        // Request made to a specific client/service provider
        else {
            if(req.user.id === req.body.client || req.user.id === req.body.service_provider){
                // Verify if both users exist and if service_provider is valid
                if(req.user.id === req.body.service_provider){
                    // Verify if is a service provider (level)
                    if(req.user.level >= 3){
                        Services.criar(req.body)
                            .then(dados => {
                                if(dados) res.jsonp("Service successfully added to the database.")
                                else res.status(500).jsonp("Error creating the service.")
                            })
                            .catch(erro => res.status(500).jsonp("Error creating the service: " + erro))
                    } else {
                        res.status(500).jsonp("Error creating the service: you are not a service provider.")
                    }
                }
                // User is the client 
                else {
                    // Check if service_provider is valid
                    await Users.listarPorId(req.body.service_provider, function(err, result){
                        if(err){
                            res.status(500).jsonp("Error creating the service: problem while validating the service provider.")
                        }else{
                            // Service provider is valid
                            if(result.level >= 3){
                                Services.criar(req.body)
                                    .then(dados => {
                                        if(dados) res.jsonp("Service successfully added to the database.")
                                        else res.status(500).jsonp("Error creating the service.")
                                    })
                                    .catch(erro => res.status(500).jsonp("Error creating the service: " + erro))
                            }
                            else{
                                res.status(500).jsonp("Error creating the service: the service provider is not valid.")
                            }
                        }
                    });
                }
            } else {
                res.status(500).jsonp("Error creating the service: you are not part of the service that you want to create.")
            }
        }
    }
})

// PUT/:id

// DELETE/:id
router.delete('/:id', Auth.isLoggedInUser, Auth.checkLevel([1, 2, 3, 3.5, 4, 5, 6, 7]), [
    eMongoId('param', 'id')
], function(req, res) {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).jsonp(errors.array())
    }

    // In case its an admin, delete is available
    if(req.user.level >= 6){
        Services.eliminar(req.params.id, function(err, user){
            if(err){
                res.status(500).send("An error ocurred while deleting the service.");
            }else{
                res.send('Service successfully deleted.')
            }
        })
    }
    // Otherwise only services requests only associated to the user can be deleted
    else {
        Services.consultar(req.params.id)
            .then(dados => {
                if(dados){
                    // service with no service provider and the client is the user
                    if(req.user.id === dados.client && dados.service_provider === undefined){
                        Services.eliminar(req.params.id, function(err, user){
                            if(err){
                                res.status(500).send("An error ocurred while deleting the service.");
                            }else{
                                res.send('Service successfully deleted.')
                            }
                        })
                    } else {
                        res.status(500).send('An error occurred while deleting the service: the service is associated to multiple users.')
                    }
                } else {
                    res.status(404).send(`Error: The data item with identified by '${req.params.id}' does not exist on the services.`)
                }
            })
	        .catch(erro => res.status(500).send(`Error while listing the service with identifier '${req.params.id}': ${erro}`))
    }
});

module.exports = router;