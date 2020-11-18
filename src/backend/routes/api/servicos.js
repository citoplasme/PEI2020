var Auth = require('../../controllers/auth.js');
var express = require('express');
var router = express.Router();
var Services = require('../../controllers/api/servicos.js');
var url = require('url')
var validKeys = ["client", "service_provider", "urgent", "status", "date", "hour", "duration"];
const { validationResult } = require('express-validator');
const { existe, eMongoId } = require('../validation')


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

// POST /

// PUT/:id

// DELETE/:id

module.exports = router;