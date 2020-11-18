var Auth = require('../../controllers/auth.js');
var express = require('express');
var router = express.Router();
var Services = require('../../controllers/api/servicos.js');
var Users = require('../../controllers/api/users.js');
var url = require('url')
var validKeys = ["client", "service_provider", "urgent", "status", "date", "hour", "duration", "desc"];
const { validationResult, body } = require('express-validator');
const { existe, eMongoId, dataValida, horaValida, vcServiceStatus, estaEm } = require('../validation')

// Para os ficheiros
var formidable = require("formidable")
var ncp = require('ncp').ncp;
ncp.limit = 16;
var fs = require('fs')

// VER NIVEIS DE ACESSO -> Verificar que user e um dos intervenientes ou é admin

// GET /services 
router.get('/', Auth.isLoggedInUser, [
    existe("query", "client").optional(),
    existe("query", "service_provider").optional(),
    existe("query", "urgent").optional(),
    existe("query", "date").optional(),
    existe("query", "hour").optional(),
    existe("query", "duration").optional(),
    existe("query", "desc").optional()
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

router.get('/:id/bill', Auth.isLoggedInUser, [
    eMongoId('param', 'id')
], (req, res) => {
    
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).jsonp(errors.array())
    }
    
    // In case its an admin, every data item should be available
    if(req.user.level >= 6){
        Services.consultar(req.params.id)
            .then(function (dados) {
                if (dados && dados.fatura) {
                    // Send file
                    var img = Buffer.from(dados.fatura, 'base64');

                    res.writeHead(200, {
                        'Content-Type': 'application/pdf',
                        'Content-Length': img.length
                    });
                    res.end(img);
                } 
                else {
                    res.status(404).send(`Error: The data item with identified by '${req.params.id}' does not exist on the services.`)
                }
            })
            .catch(erro => res.status(500).send(`Error while listing the service with identifier '${req.params.id}': ${erro}`))
    } 
    // Otherwise, the user should only be capable of seeing services that he is part on
    else {
        Services.consultar_from_user(req.params.id, req.user.id)
            .then(function (dados) {
                if (dados && dados.fatura) {
                    // Send file
                    var img = Buffer.from(dados.fatura, 'base64');

                    res.writeHead(200, {
                        'Content-Type': 'application/pdf',
                        'Content-Length': img.length
                    });
                    res.end(img);
                } 
                else {
                    res.status(404).send(`Error: The data item with identified by '${req.params.id}' does not exist on the services.`)
                }
            })
            .catch(erro => res.status(500).send(`Error while listing the service with identifier '${req.params.id}': ${erro}`))
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
    estaEm('body', 'status', vcServiceStatus),
    dataValida("body", "date").optional(), 
    horaValida("body", "hour").optional(), 
    existe("body", "duration").optional(),
    existe("body", "desc").optional(),
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

// PUT/:id/bid
// Check if user is part of the service
    // Check if status is negotiation 
        // Adds bid to array
router.put('/:id/bid', Auth.isLoggedInUser, Auth.checkLevel([1, 2, 3, 3.5, 4, 5, 6, 7]), [
    eMongoId('param', 'id'),
    existe("body", "value")
], (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(422).jsonp(errors.array())
    }
    
    Services.consultar(req.params.id)
        .then(dados => {
            if(dados) {
                // Check if user is part of the service
                if(dados.client === req.user.id || dados.service_provider === req.user.id ){
                    // Check status
                    if(dados.status === 1){
                        // Update the bidding array
                        Services.update_bid(req.params.id, req.body.value, req.user.id)
                            .then(dados => {
                                if(dados) res.jsonp("Bid successfully added to service.")
                                else res.status(500).jsonp("Error while negotiating the service with identifier '" + req.params.id + "'.")
                            })
                            .catch(erro => res.status(500).jsonp("Error while negotiating the service with identifier '" + req.params.id + "': " + erro))
                    }
                    else {
                        res.status(500).jsonp("Error updating the service: the service is not on negotiation status.")
                    }
                }
                else {
                    res.status(500).jsonp("Error updating the service: you are not part of the service.")
                }
            }
            else {
                res.status(500).jsonp("Error updating the service with identifier '" + req.params.id + "':.")
            }
        })
        .catch(error => res.status(500).jsonp("Error updating the service with identifier '" + req.params.id + "': " + error))
})

// PUT/:id/fatura
// Check if user is service provider of the service
    // Check if status is >= 3 
        // Adds fatura
router.put('/:id/bill', Auth.isLoggedInUser, Auth.checkLevel([3, 3.5, 4, 5, 6, 7]), [
    eMongoId('param', 'id')
], function (req, res) {
    
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(422).jsonp(errors.array())
    }

    var form = new formidable.IncomingForm()
    form.parse(req, async (error, fields, formData) => {
        if(!error){
            // Verify the existance of the file
            if(formData.file && formData.file.type && formData.file.path){
                // Verify if the file is a PDF
                if(formData.file.type === "application/pdf"){
                    // Verify if the user is the service provider
                    Services.consultar(req.params.id)
                        .then(dados => {
                            if(dados) {
                                // Check if user is part of the service
                                if(dados.service_provider === req.user.id ){
                                    // Check status
                                    if(dados.status >= 3){
                                        // Generate encoded string
                                        const contents = fs.readFileSync(formData.file.path, {encoding: 'base64'});
                                        // Saving the encoded file
                                        Services.update_fatura(req.params.id, contents)
                                            .then(dados => {
                                                if(dados) res.jsonp("Bill successfully added to service.")
                                                else res.status(500).jsonp("Error while adding the bill for the service with identifier '" + req.params.id + "'.")
                                            })
                                            .catch(erro => res.status(500).jsonp("Error while adding the bill for the service with identifier '" + req.params.id + "': " + erro))
                                    }
                                    else {
                                        res.status(500).jsonp("Error updating the service: the service is not completed.")
                                    }
                                }
                                else {
                                    res.status(500).jsonp("Error updating the service: you are not the service provider of the service.")
                                }
                            }
                            else {
                                res.status(500).jsonp("Error updating the service with identifier '" + req.params.id + "':.")
                            }
                        })
                        .catch(error => res.status(500).jsonp("Error updating the service with identifier '" + req.params.id + "': " + error))
                } else {
                    res.status(500).json(`Error while updating the service: the file has to be PDF.`)
                }
            } else {
                res.status(500).json(`Error while updating the service: the file was not sent.`)
            }
        }
        else {
            res.status(500).json(`Error while updating the service: ${error}`)
        }
    })
})

// PUT/:id/review
// Check if user is part of the service
    // Check if status is == 3 
        // Adds review
            // Check if both reviews are present 
                // Updates status
                    // Updates karma
router.put('/:id/review', Auth.isLoggedInUser, Auth.checkLevel([1, 2, 3, 3.5, 4, 5, 6, 7]), [
    eMongoId('param', 'id')
], (req, res) => {

    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(422).jsonp(errors.array())
    }
    
    Services.consultar(req.params.id)
        .then(dados => {
            if(dados) {
                // review phase
                if(dados.status === 3){
                    // Check if user is part of the service
                    if(dados.client === req.user.id || dados.service_provider === req.user.id ){
                        // Check if user is the client 
                        if(dados.client === req.user.id){
                            // Check if every field is present
                            if(req.body.ponctuality && req.body.quality && req.body.security && req.body.attendance && req.body.general){
                                // Check if values are numbers
                                if(typeof req.body.ponctuality === "number" && typeof req.body.quality === "number" && typeof req.body.security === "number" && typeof req.body.attendance === "number" && typeof req.body.general === "number"){
                                    let review = {
                                        ponctuality: req.body.ponctuality,
                                        quality: req.body.quality,
                                        security: req.body.security, 
                                        attendance: req.body.attendance,
                                        general: req.body.general,
                                    };

                                    // Check if desc is present
                                    if (req.body.comentario){
                                        review.comentario = req.body.comentario;
                                    }
                                    // Calculate karma for this service
                                    review.karma = Services.calculate_karma_client(review);

                                    // Update the DB
                                    Services.update_review_from_client(req.params.id, review)
                                            .then(dados => {
                                                if(dados) {
                                                    // Check if both reviews are present
                                                    if(dados.review && dados.review.client && dados.review.service_provider){
                                                        // Update status
                                                        Services.update_status(req.params.id, 4)
                                                            .then(dados => {
                                                                if(dados) res.jsonp("Review added and service status successfully updated to the service.") // UPDATE USER KARMA !!!!!!!!
                                                                else res.status(500).jsonp("Error while adding the review and updating the status for the service with identifier '" + req.params.id + "'.")
                                                            })
                                                            .catch(erro => res.status(500).jsonp("Error while adding the review and updating the status for the service with identifier '" + req.params.id + "': " + erro))
                                                    }
                                                    else {   
                                                        res.jsonp("Review successfully added to service.")
                                                    }
                                                }
                                                else res.status(500).jsonp("Error while adding the review for the service with identifier '" + req.params.id + "'.")
                                            })
                                            .catch(erro => res.status(500).jsonp("Error while adding the review for the service with identifier '" + req.params.id + "': " + erro))

                                } 
                                else {
                                    res.status(500).jsonp("Error updating the service: the review fields are numeric, expect for the comment.")
                                }
                            }
                            else {
                                res.status(500).jsonp("Error updating the service: some review fields are missing.")
                            }  
                        }
                        // Check if user is the service_provider
                        else if(dados.service_provider === req.user.id ){
                            // Check if every field is present
                            if(req.body.payment && req.body.ponctuality && req.body.security && req.body.general){
                                // Check if values are numeric
                                if(typeof req.body.payment === "number" && typeof req.body.ponctuality === "number" && typeof req.body.security === "number" && typeof req.body.general === "number"){
                                
                                    let review = {
                                        ponctuality: req.body.ponctuality,
                                        payment: req.body.payment,
                                        security: req.body.security, 
                                        general: req.body.general,
                                    };

                                    // Check if desc is present
                                    if (req.body.comentario){
                                        review.comentario = req.body.comentario;
                                    }
                                    // Calculate karma for this service
                                    review.karma = Services.calculate_karma_service_provider(review);

                                    // Update the DB
                                    Services.update_review_from_service_provider(req.params.id, review)
                                    .then(dados => {
                                        if(dados) {
                                            // Check if both reviews are present
                                            if(dados.review && dados.review.client && dados.review.service_provider){
                                                // Update status
                                                Services.update_status(req.params.id, 4)
                                                    .then(dados => { 
                                                        if(dados) res.jsonp("Review added and service status successfully updated to the service.") // UPDATE USER KARMA !!!!!!!!
                                                        else res.status(500).jsonp("Error while adding the review and updating the status for the service with identifier '" + req.params.id + "'.")
                                                    })
                                                    .catch(erro => res.status(500).jsonp("Error while adding the review and updating the status for the service with identifier '" + req.params.id + "': " + erro))
                                            }
                                            else {   
                                                res.jsonp("Review successfully added to service.")
                                            }
                                        }
                                        else res.status(500).jsonp("Error while adding the review for the service with identifier '" + req.params.id + "'.")
                                    })
                                    .catch(erro => res.status(500).jsonp("Error while adding the review for the service with identifier '" + req.params.id + "': " + erro))
                                } 
                                else {
                                    res.status(500).jsonp("Error updating the service: the review fields are numeric, expect for the comment.")
                                }
                            } 
                            else {
                                res.status(500).jsonp("Error updating the service: some review fields are missing.")
                            }
                        }
                        else {
                            res.status(500).jsonp("Error updating the service: you are not part of the service.")
                        }
                    }
                    else {
                        res.status(500).jsonp("Error updating the service: you are not part of the service.")
                    }
                }
                else {
                    res.status(500).jsonp("Error updating the service: the service is not on review status.")
                }
            }
            else {
                res.status(500).jsonp("Error updating the service with identifier '" + req.params.id + "':.")
            }
        })
        .catch(error => res.status(500).jsonp("Error updating the service with identifier '" + req.params.id + "': " + error))
})



// PUT/:id/status
// Check if user is part of the service
    // If new status == -1 Canceled
        // Checks if date - now >= 24h
            // Updates status
    // If new status == -2 Recused || new status == 2 accepted
        // Check if last bid was from the other part of the service
            // Update status 
    // If new status === 4 
        // Update Karmas
            // Update status
    // Else
        // Updates status

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