var Auth = require('../../controllers/auth.js');
var express = require('express');
var router = express.Router();
var Specializations = require('../../controllers/api/specializations.js');
var Categories = require('../../controllers/api/categories.js');
var url = require('url')
var validKeys = ["category", "name", "desc", "active"];
const { validationResult } = require('express-validator');
const { existe, eMongoId } = require('../validation');

// GET /specializations 
// ?category=XXX
// ?name=XXX
// ?desc=XXX
// ?active=XXX
router.get('/', Auth.isLoggedInKey, [
    existe("query", "category").optional(),
    existe("query", "name").optional(),
    existe("query", "desc").optional(),
    existe("query", "active")
        .bail()
        .isBoolean()
        .withMessage("The value is not boolean: 'true', 'false'")
        .optional(),
], (req, res) => {
    
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).jsonp(errors.array())
    }

    var queryData = url.parse(req.url, true).query;
    
    var filtro = Object.entries(queryData)
        .filter(([k, v]) => validKeys.includes(k))

    filtro = Object.assign({}, ...Array.from(filtro, ([k, v]) => ({[k]: v}) ));
    
    Specializations.listar(filtro)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send(`Error while listing specializations: ${erro}`))
})

// GET /specializations/:id
router.get('/:id', Auth.isLoggedInKey, [
    eMongoId('param', 'id')
], (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).jsonp(errors.array())
    }

    Specializations.consultar(req.params.id)
        .then(dados => dados ? res.jsonp(dados) : res.status(404).send(`Error: The data item with identified by '${req.params.id}' does not exist on the specializations.`))
	    .catch(erro => res.status(500).send(`Error while listing the specialization with identifier '${req.params.id}': ${erro}`))
})

// POST /specializations
router.post('/', Auth.isLoggedInUser, Auth.checkLevel([3, 3.5, 4, 5, 6, 7]), [
    existe("body", "name"),
    existe("body", "desc").optional(),
    existe("body", "active")
        .bail()
        .isBoolean()
        .withMessage("The value is not boolean: 'true', 'false'"),
    existe("body", "category"),
    eMongoId('body', 'category')
], (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).jsonp(errors.array())
    }
    // Check if category exists
    Categories.consultar(req.body.category)
        .then(dados => {
            if(dados) {
                // Check if specialization is not associated to the category
                Specializations.consultar_by_category(req.body.category)
                    .then(dad => {
                        if(dad && dad.length > 0 && dad.find(element => element.name === req.body.name)){
                            res.status(500).jsonp("The specialization already exists '" + req.body.name) 
                        }
                        else {
                            // Verify if admin
                            if(req.user.level >= 5){
                                Specializations.criar(req.body)
                                    .then(dados => {
                                        if(dados) res.jsonp("Specialization successfully created.")
                                        else res.status(500).jsonp("Error creating the specialization '" + req.body.name + "'.")
                                    })
                                    .catch(erro => res.status(500).jsonp("Error creating the specialization '" + req.body.name + "': " + erro))
                            }
                            else {
                                // Verify if active is false
                                if(req.body.active === 'false'){
                                    Specializations.criar(req.body)
                                        .then(dados => {
                                            if(dados) res.jsonp("Specialization successfully created.")
                                            else res.status(500).jsonp("Error creating the specialization '" + req.body.name + "'.")
                                        })
                                        .catch(erro => res.status(500).jsonp("Error creating the specialization '" + req.body.name + "': " + erro))
                                } 
                                else {
                                    res.status(500).jsonp("Error creating the specialization: you can not create an active specialization.")
                                }
                            }
                        }
                    })
                    .catch(error => res.status(500).jsonp("Error creating the specialization '" + req.body.name + "': " + error))
            }
            else res.status(500).jsonp("The category does not exist on the database.")
        })
        .catch(error => res.status(500).jsonp("Error creating the specialization '" + req.body.name + "': " + error))
})

// PUT /specializations/:id 
router.put('/:id', Auth.isLoggedInUser, Auth.checkLevel([5, 6, 7]), [
    existe("body", "name"),
    existe("body", "desc").optional(),
    existe("body", "active")
        .bail()
        .isBoolean()
        .withMessage("The value is not boolean: 'true', 'false'"),
    existe("body", "category"),
    eMongoId('body', 'category'),
    eMongoId('param', 'id')
], (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).jsonp(errors.array())
    }
    // Check if category exists
    Categories.consultar(req.body.category)
        .then(dados => {
            if(dados) {
                // Check if specialization is not associated to the category
                Specializations.consultar_by_category(req.body.category)
                    .then(dad => {
                        if(dad.find(element => element.name == req.body.name && element._id != req.params.id)){
                            res.status(500).jsonp("The specialization already exists '" + req.body.name) 
                        }
                        else {
                            Specializations.update(req.params.id, req.body)
                                .then(dados => {
                                    if(dados) res.jsonp("Specialization successfully updated.")
                                    else res.status(500).jsonp("Error updating the specialization '" + req.body.name + "'.")
                                })
                                .catch(erro => res.status(500).jsonp("Error updating the specialization '" + req.body.name + "': " + erro))
                        }
                    })
                    .catch(error => res.status(500).jsonp("Error updating the specialization '" + req.body.name + "': " + error))
            }
            else res.status(500).jsonp("The category does not exist on the database.")
        })
        .catch(error => res.status(500).jsonp("Error updating the specialization '" + req.body.name + "': " + error))
})

// DELETE /specializations/:id
router.delete('/:id', Auth.isLoggedInUser, Auth.checkLevel([5, 6, 7]), [
    eMongoId('param', 'id')
], function(req, res) {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).jsonp(errors.array())
    }

    Specializations.eliminar(req.params.id, function(err, user){
        if(err){
            res.status(500).send("An error ocurred while deleting the specialization.");
        }else{
            res.send('Specialiation successfully deleted.');
        }
    })
});

module.exports = router;