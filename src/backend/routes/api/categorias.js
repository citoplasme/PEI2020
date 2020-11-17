var express = require('express');
var Logging = require('../../controllers/logging');
var router = express.Router();
var passport = require('passport');
var Categoria = require('../../models/categorias');
var Categorias = require('../../controllers/api/categorias');
var AuthCalls = require('../../controllers/api/auth');
var Auth = require('../../controllers/auth');
var jwt = require('jsonwebtoken');
var secretKey = require('./../../config/app');
var Mailer = require('../../controllers/api/mailer');
var mongoose = require('mongoose');
const { existe, eMongoId } = require('../validation');
const { validationResult } = require('express-validator');
var url = require('url')

router.post('/', Auth.isLoggedInUser, Auth.checkLevel(3), async (req, res) => {
    var newCategoria = new Categoria({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        desc: req.body.desc,
        status: 0,
        subCategorias: []
    });

    Categorias.getCategoriaByName(req.body.name, async function(err, cat){
        if (err) {
            //return res.status(500).send(`Erro: ${err}`);
            return res.status(500).send('It was not possible to register the category. Please check if the values are correct or if something is missing.');
        }

        if (!cat) {
            await Categorias.createCategoria(newCategoria, function (err, user) {
                if (err) {
                    //return res.status(500).send(`Erro: ${err}`);
                    return res.status(500).send('It was not possible to register the category. Please check if the values are correct or if something is missing.');
                }
            });
            res.send('Category registered with success.');
        } else {
            res.status(500).send('It was not possible to register the Category: the category already created.');
        }
    })
});

router.put('/:name', Auth.isLoggedInUser, Auth.checkLevel(6), async function(req, res) {

    var newCategoria = new Categoria({
        _id: mongoose.Types.ObjectId(),
        name: req.params.name,
        desc: req.body.desc,
        status: req.body.status,
        subCategorias: [
        ]
    });
    
    Categorias.editCategoria(newCategoria,function(err,cat){
        if(err){
        
            res.status(500).send("It was not possible to edit the category.");
        }else{
            res.send('Category edited with success.');
        }
    })
});


var validKeys = ["status"];
router.get('/', Auth.isLoggedInKey,existe("query", "status").optional(), (req, res) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).jsonp(errors.array())
    }

    var queryData = url.parse(req.url, true).query;

    var filtro = Object.entries(queryData)
        .filter(([k, v]) => validKeys.includes(k))

    filtro = Object.assign({}, ...Array.from(filtro, ([k, v]) => ({[k]: v}) ));
    
    Categorias.getAllCategorias(filtro,function(err,result){
        if(err){
            res.status(500).send("It was not possible to list all categories.");
        }else{
            res.send(result);
        }
    })
});

router.delete('/:name', Auth.isLoggedInUser, Auth.checkLevel(6), function(req, res) {
    
    Categorias.deleteCategoriaByName(req.params.name,function(err,result){
        if(err){
            res.status(500).send("It was not possible to delete the category.");
        }else{
            res.send(result);
        }
    })
});
//-------------- novos

router.get('/:name', Auth.isLoggedInUser, Auth.checkLevel(-1), function(req, res) {
    
    Categorias.getCategoriaByName(req.params.name,function(err,result){
        if(err){
            res.status(500).send("It was not possible to get the category.");
        }else{
            res.send(result);
        }
    })
});

router.get('/categoria/:nameCat/subCategoria/:nameSubCat', Auth.isLoggedInUser, Auth.checkLevel(-1), function(req, res) {
    
    Categorias.getSubCategoriaByName(req.params.nameCat,req.params.nameSubCat,function(err,result){
        if(err){
            res.status(500).send("It was not possible to get the subcategory.");
        }else{
            res.send(result);
        }
    })
});

router.put('/categoria/:nameCat/subCategoria/:nameSubCat', Auth.isLoggedInUser, Auth.checkLevel(6), async function(req, res) {
    
    var newCategoria = new Categoria({
        _id: mongoose.Types.ObjectId(),
        name: req.params.nameCat,
        subCategorias: [
            {
                _id: mongoose.Types.ObjectId(),
                name: req.params.nameSubCat,
                desc: req.body.descSubCategoria,
                status: req.body.statusSubCategoria
            }
        ]
    });

    Categorias.editSubCategoria(newCategoria,function(err,cat){
        if(err){
        
            res.status(500).send("It was not possible to validate the category.");
        }else{
            res.send('Category validated with success.');
        }
    })
});


router.get('/:name/subCategorias', Auth.isLoggedInKey,existe("query", "status").optional(), (req, res) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).jsonp(errors.array())
    }

    var queryData = url.parse(req.url, true).query;

    var filtro = Object.entries(queryData)
        .filter(([k, v]) => validKeys.includes(k))

    filtro = Object.assign({}, ...Array.from(filtro, ([k, v]) => ({[k]: v}) ));
    
    
    Categorias.getAllSubCategorias(req.params.name,filtro,function(err,result){
        if(err){
            res.status(500).send("It was not possible to list all Subcategories.");
        }else{
            res.send(result);
        }
    })
});

router.delete('/categoria/:nameCat/subCategoria/:nameSubCat', Auth.isLoggedInUser, Auth.checkLevel(6), function(req, res) {
    
    Categorias.deleteSubCategoriaByName(req.params.nameCat,req.params.nameSubCat,function(err,result){
        if(err){
            res.status(500).send("It was not possible to delete the Subcategory.");
        }else{
            res.send(result);
        }
    })
});

router.post('/:categoria', Auth.isLoggedInUser, Auth.checkLevel(6), async (req, res) => {
    var newCategoria = new Categoria({
        _id: mongoose.Types.ObjectId(),
        name: req.params.categoria,
        desc: req.body.descCategoria,
        status: 0,
        subCategorias: [
            {
                _id: mongoose.Types.ObjectId(),
                name: req.body.nameSubCategoria,
                desc: req.body.descSubCategoria,
                status: 0,
            }
        ]
    });

    Categorias.createSubCategoria(newCategoria,function(err,cat){
        if (err){
            if (err ="SubCategory already exists."){
                return res.status(500).send('SubCategory already exists.');    
            }
            return res.status(500).send('It was not possible to register the Subcategory. Please check if the values are correct or if something is missing.');
        }
        else{
            res.send('SubCategory registered with success.');
        }
    })
});

module.exports = router;
