var Auth = require('../../controllers/auth.js');
var express = require('express');
var router = express.Router();
var Locations = require('../../controllers/api/locations.js');
var url = require('url')
var validKeys = ["country"];
const { validationResult } = require('express-validator');
const { existe, eMongoId } = require('../validation')

// GET /locations 
// ?country=XXX
router.get('/', Auth.isLoggedInKey, [
    existe("query", "country").optional()
], (req, res) => {
    
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).jsonp(errors.array())
    }

    var queryData = url.parse(req.url, true).query;
    
    var filtro = Object.entries(queryData)
        .filter(([k, v]) => validKeys.includes(k))

    filtro = Object.assign({}, ...Array.from(filtro, ([k, v]) => ({[k]: v}) ));
    
    Locations.listar(filtro)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send(`Error while listing locations: ${erro}`))
})

// GET /locations/countries
router.get('/countries', Auth.isLoggedInKey, (req, res) => {  
    Locations.listarCountries()
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send(`Error while listing countries: ${erro}`))
})

// GET /locations/:id
router.get('/:id', Auth.isLoggedInKey, [
    eMongoId('param', 'id')
], (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).jsonp(errors.array())
    }

    Locations.consultar(req.params.id)
        .then(dados => dados ? res.jsonp(dados) : res.status(404).send(`Error: The data item with identified by '${req.params.id}' does not exist on the locations.`))
	    .catch(erro => res.status(500).send(`Error while listing the location with identifier '${req.params.id}': ${erro}`))
})

// POST /locations

// POST /locations/:id

// PUT /locations/:id 

// DELETE /locations/:id

module.exports = router;