var Auth = require('../../controllers/auth.js');
var express = require('express');
var router = express.Router();
var Countries = require('../../controllers/api/countries.js');
var Locations = require('../../controllers/api/locations.js');
var url = require('url')
var validKeys = ["name"];
const { validationResult } = require('express-validator');
const { existe, eMongoId } = require('../validation')

// GET /countries 
// ?name=XXX
router.get('/', Auth.isLoggedInKey, [
    existe("query", "name").optional()
], (req, res) => {
    
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).jsonp(errors.array())
    }

    var queryData = url.parse(req.url, true).query;
    
    var filtro = Object.entries(queryData)
        .filter(([k, v]) => validKeys.includes(k))

    filtro = Object.assign({}, ...Array.from(filtro, ([k, v]) => ({[k]: v}) ));
    
    Countries.listar(filtro)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send(`Error while listing the countries: ${erro}`))
})

// GET /countries/:id
router.get('/:id', Auth.isLoggedInKey, [
    eMongoId('param', 'id')
], (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).jsonp(errors.array())
    }

    Countries.consultar(req.params.id)
        .then(dados => dados ? res.jsonp(dados) : res.status(404).send(`Error: The data item with identified by '${req.params.id}' does not exist on the countries.`))
	    .catch(erro => res.status(500).send(`Error while listing the country with identifier '${req.params.id}': ${erro}`))
})

// POST /countries
router.post('/', Auth.isLoggedInUser, Auth.checkLevel([6, 7]), [
    existe("body", "name")
], (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).jsonp(errors.array())
    }
    Countries.consultar_by_name(req.body.name)
        .then(dados => {
            if(dados) res.status(500).jsonp("The country '" + req.body.name + "' is already on the database.")
            else {
                Countries.criar(req.body.name)
                    .then(dados => {
                        if(dados) res.jsonp("Country successfully added to the database.")
                        else res.status(500).jsonp("Error creating the country '" + req.body.name + "'")
                    })
                    .catch(erro => res.status(500).jsonp("Error creating the country '" + req.body.name + "': " + erro))
            }
        })
        .catch(error => res.status(500).jsonp("Error creating the country '" + req.body.name + "': " + error))
})

// PUT /countries/:id 
router.put('/:id', Auth.isLoggedInUser, Auth.checkLevel([6, 7]), [
    eMongoId('param', 'id'),
    existe("body", "name")
], (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(422).jsonp(errors.array())
    }
    Countries.update(req.params.id, req.body.name)
        .then(dados => {
            if(dados) res.jsonp("Country successfully modified.")
            else res.status(500).jsonp("Error while modifying the country with identifier '" + req.params.id + "'.")
        })
        .catch(erro => res.status(500).jsonp("Error while modifying the country with identifier '" + req.params.id + "': " + erro))
})

// DELETE /countries/:id
// Drop locations
router.delete('/:id', Auth.isLoggedInUser, Auth.checkLevel([6, 7]), [
    eMongoId('param', 'id')
], function(req, res) {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).jsonp(errors.array())
    }

    Countries.eliminar(req.params.id, function(err, user){
        if(err){
            res.status(500).send("An error ocurred while deleting the country.");
        }else{
            // Delete locations assciated to country
            Locations.delete_all_from_country(req.params.id)
                .then(dados => {
                    res.send('Country successfully deleted.');
                })
                .catch(erro => res.status(500).send("An error ocurred while deleting the locations associated with the country."))
        }
    })
});

module.exports = router;