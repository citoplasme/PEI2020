var Auth = require('../../controllers/auth.js');
var express = require('express');
var router = express.Router();
var Locations = require('../../controllers/api/locations.js');
var Countries = require('../../controllers/api/countries.js');
var url = require('url')
var validKeys = ["country", "name"];
const { validationResult } = require('express-validator');
const { existe, eMongoId } = require('../validation');

// GET /locations 
// ?country=XXX
// ?name=XXX
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
router.post('/', Auth.isLoggedInUser, Auth.checkLevel([6, 7]), [
    existe("body", "name"),
    existe("body", "country"),
    eMongoId('body', 'country')
], (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).jsonp(errors.array())
    }
    // Check if country exists
    Countries.consultar(req.body.country)
        .then(dados => {
            if(dados) {
                // Check if location is not associated to the country
                Locations.consultar_by_country(req.body.country)
                    .then(dad => {
                        if(dad.find(element => element.name === req.body.name)){
                            res.status(500).jsonp("The location already exists '" + req.body.name) 
                        }
                        else {
                            Locations.criar(req.body)
                                .then(dados => {
                                    if(dados) res.jsonp("Location successfully created.")
                                    else res.status(500).jsonp("Error creating the location '" + req.body.name + "'.")
                                })
                                .catch(erro => res.status(500).jsonp("Error creating the location '" + req.body.name + "': " + erro))
                        }
                    })
                    .catch(error => res.status(500).jsonp("Error creating the location '" + req.body.name + "': " + error))
            }
            else res.status(500).jsonp("The country does not exist on the database.")
        })
        .catch(error => res.status(500).jsonp("Error creating the location '" + req.body.name + "': " + error))
})

// PUT /locations/:id 
router.put('/:id', Auth.isLoggedInUser, Auth.checkLevel([6, 7]), [
    existe("body", "name"),
    existe("body", "country"),
    eMongoId('body', 'country'),
    eMongoId('param', 'id')
], (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).jsonp(errors.array())
    }
    // Check if country exists
    Countries.consultar(req.body.country)
        .then(dados => {
            if(dados) {
                // Check if location is not associated to the country
                Locations.consultar_by_country(req.body.country)
                    .then(dad => {
                        if(dad.find(element => element.name === req.body.name)){
                            res.status(500).jsonp("The location already exists '" + req.body.name) 
                        }
                        else {
                            Locations.update(req.params.id, req.body)
                                .then(dados => {
                                    if(dados) res.jsonp("Location successfully updated.")
                                    else res.status(500).jsonp("Error updating the location '" + req.body.name + "'.")
                                })
                                .catch(erro => res.status(500).jsonp("Error updating the location '" + req.body.name + "': " + erro))
                        }
                    })
                    .catch(error => res.status(500).jsonp("Error updating the location '" + req.body.name + "': " + error))
            }
            else res.status(500).jsonp("The country does not exist on the database.")
        })
        .catch(error => res.status(500).jsonp("Error updating the location '" + req.body.name + "': " + error))
})

// DELETE /locations/:id
router.delete('/:id', Auth.isLoggedInUser, Auth.checkLevel([6, 7]), [
    eMongoId('param', 'id')
], function(req, res) {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).jsonp(errors.array())
    }

    Locations.eliminar(req.params.id, function(err, user){
        if(err){
            res.status(500).send("An error ocurred while deleting the location.");
        }else{
            res.send('Location successfully deleted.');
        }
    })
});

module.exports = router;