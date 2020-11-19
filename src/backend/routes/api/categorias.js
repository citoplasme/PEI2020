var Auth = require('../../controllers/auth.js');
var express = require('express');
var router = express.Router();
var Categories = require('../../controllers/api/categorias.js');
var Specializations = require('../../controllers/api/specializations.js');
var url = require('url')
var validKeys = ["name", "active", "desc"];
const { validationResult } = require('express-validator');
const { existe, eMongoId } = require('../validation')

// GET /categories 
// ?name=XXX
// ?active=XXX
// ?desc=XXX 
router.get('/', Auth.isLoggedInKey, [
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
    
    Categories.listar(filtro)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send(`Error while listing the categories: ${erro}`))
})

// GET /categories/:id
router.get('/:id', Auth.isLoggedInKey, [
    eMongoId('param', 'id')
], (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).jsonp(errors.array())
    }

    Categories.consultar(req.params.id)
        .then(dados => dados ? res.jsonp(dados) : res.status(404).send(`Error: The data item with identified by '${req.params.id}' does not exist on the categories.`))
	    .catch(erro => res.status(500).send(`Error while listing the category with identifier '${req.params.id}': ${erro}`))
})

// POST /categories
router.post('/', Auth.isLoggedInUser, Auth.checkLevel([3, 3.5, 4, 5, 6, 7]), [
    existe("body", "name"),
    existe("body", "desc").optional(),
    existe("body", "active")
        .bail()
        .isBoolean()
        .withMessage("The value is not boolean: 'true', 'false'")
], (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).jsonp(errors.array())
    }

    Categories.consultar_by_name(req.body.name)
        .then(dados => {
            if(dados && dados.length > 0) res.status(500).jsonp("The category '" + req.body.name + "' is already on the database.")
            else {
                // Verify if admin
                if(req.user.level >= 6){                            
                    Categories.criar(req.body)
                        .then(dados => {
                            if(dados) res.jsonp("Category successfully added to the database.")
                            else res.status(500).jsonp("Error creating the category '" + req.body.name + "'")
                        })
                        .catch(erro => res.status(500).jsonp("Error creating the category '" + req.body.name + "': " + erro))
                }
                else {
                    // Verify if active is false
                    if(req.body.active === 'false'){
                        Categories.criar(req.body)
                            .then(dados => {
                                if(dados) res.jsonp("Category successfully added to the database.")
                                else res.status(500).jsonp("Error creating the category '" + req.body.name + "'")
                            })
                            .catch(erro => res.status(500).jsonp("Error creating the category '" + req.body.name + "': " + erro))
                    }
                    else {
                        res.status(500).jsonp("Error creating the category: you can not create an active category.")
                    }
                }
            }
        })
        .catch(error => res.status(500).jsonp("Error creating the category '" + req.body.name + "': " + error))
})

// PUT /categories/:id 
router.put('/:id', Auth.isLoggedInUser, Auth.checkLevel([6, 7]), [
    eMongoId('param', 'id'),
    existe("body", "name"),
    existe("body", "desc").optional(),
    existe("body", "active")
        .bail()
        .isBoolean()
        .withMessage("The value is not boolean: 'true', 'false'")
], (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(422).jsonp(errors.array())
    }

    Categories.consultar_by_name(req.body.name)
        .then(dados => {
            if(dados && dados.find(element => element._id != req.params.id)) {
                res.status(500).jsonp("The category '" + req.body.name + "' is already on the database.")
            }
            else {
                Categories.update(req.params.id, req.body)
                    .then(dados => {
                        if(dados) res.jsonp("Category successfully modified.")
                        else res.status(500).jsonp("Error while modifying the category with identifier '" + req.params.id + "'.")
                    })
                    .catch(erro => res.status(500).jsonp("Error while modifying the category with identifier '" + req.params.id + "': " + erro))
            }
        })
        .catch(error => res.status(500).jsonp("Error creating the category '" + req.body.name + "': " + error))

    
})

// DELETE /categories/:id
// Drop specializations
router.delete('/:id', Auth.isLoggedInUser, Auth.checkLevel([6, 7]), [
    eMongoId('param', 'id')
], function(req, res) {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).jsonp(errors.array())
    }

    Categories.eliminar(req.params.id, function(err, user){
        if(err){
            res.status(500).send("An error ocurred while deleting the category.");
        }else{
            // Delete specializations assciated to category
            Specializations.delete_all_from_category(req.params.id)
                .then(dados => {
                    res.send('Category successfully deleted.');
                })
                .catch(erro => res.status(500).send("An error ocurred while deleting the specializations associated with the category."))
        }
    })
});

module.exports = router;