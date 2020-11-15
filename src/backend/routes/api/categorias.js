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

router.post('/create', Auth.isLoggedInUser, Auth.checkLevel(2), async (req, res) => {
    var newCategoria = new Categoria({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        desc: req.body.desc,
        active: false,
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

router.put('/validate/:name', Auth.isLoggedInUser, Auth.checkLevel(6), async function(req, res) {
    
    Categorias.validateCategoria(req.params.name,function(err,cat){
        if(err){
        
            res.status(500).send("It was not possible to validate the category.");
        }else{
            res.send('Category validated with success.');
        }
    })
});

router.get('/listAll', Auth.isLoggedInUser, Auth.checkLevel(6), function(req, res) {
    
    Categorias.getAllCategorias(req,function(err,result){
        if(err){
            res.status(500).send("It was not possible to list all categories.");
        }else{
            res.send(result);
        }
    })
});

router.get('/listAllActive', Auth.isLoggedInUser, Auth.checkLevel(-1), function(req, res) {
    
    Categorias.getAllCategoriasActive(req,function(err,result){
        if(err){
            res.status(500).send("It was not possible to list all categories.");
        }else{
            res.send(result);
        }
    })
});

router.delete('/delete/:name', Auth.isLoggedInUser, Auth.checkLevel(6), function(req, res) {
    
    Categorias.deleteCategoriaByName(req.params.name,function(err,result){
        if(err){
            res.status(500).send("It was not possible to delete the category.");
        }else{
            res.send(result);
        }
    })
});
//-------------- novos

router.get('/categoriaByName/:name', Auth.isLoggedInUser, Auth.checkLevel(-1), function(req, res) {
    
    Categorias.getCategoriaByName(req.params.name,function(err,result){
        if(err){
            res.status(500).send("It was not possible to get the category.");
        }else{
            res.send(result);
        }
    })
});


router.post('/createSubCategoria', Auth.isLoggedInUser, Auth.checkLevel(2), async (req, res) => {
    var newCategoria = new Categoria({
        _id: mongoose.Types.ObjectId(),
        name: req.body.nameCategoria,
        desc: req.body.descCategoria,
        active: false,
        subCategorias: [
            {
                _id: mongoose.Types.ObjectId(),
                name: req.body.nameSubCategoria,
                desc: req.body.descSubCategoria,
                active: false
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

router.get('/subCategoriaByName/:nameCat/:nameSubCat', Auth.isLoggedInUser, Auth.checkLevel(-1), function(req, res) {
    
    Categorias.getSubCategoriaByName(req.params.nameCat,req.params.nameSubCat,function(err,result){
        if(err){
            res.status(500).send("It was not possible to get the subcategory.");
        }else{
            res.send(result);
        }
    })
});

router.put('/validateSubCategoria/:nameCat/:nameSubCat', Auth.isLoggedInUser, Auth.checkLevel(6), async function(req, res) {
    
    Categorias.validateSubCategoria(req.params.nameCat,req.params.nameSubCat,function(err,cat){
        if(err){
        
            res.status(500).send("It was not possible to validate the category.");
        }else{
            res.send('Category validated with success.');
        }
    })
});

router.get('/listAllSubCategorias/:name', Auth.isLoggedInUser, Auth.checkLevel(6), function(req, res) {
    
    Categorias.getAllSubCategorias(req.params.name,function(err,result){
        if(err){
            res.status(500).send("It was not possible to list all Subcategories.");
        }else{
            res.send(result);
        }
    })
});

router.get('/listAllSubCategoriasActive/:name', Auth.isLoggedInUser, Auth.checkLevel(-1), function(req, res) {
    
    Categorias.getAllSubCategoriasActive(req.params.name,function(err,result){
        if(err){
            res.status(500).send("It was not possible to list all Subcategories.");
        }else{
            res.send(result);
        }
    })
});

router.delete('/deleteSubCategoria/:nameCat/:nameSubCat', Auth.isLoggedInUser, Auth.checkLevel(6), function(req, res) {
    
    Categorias.deleteSubCategoriaByName(req.params.nameCat,req.params.nameSubCat,function(err,result){
        if(err){
            res.status(500).send("It was not possible to delete the Subcategory.");
        }else{
            res.send(result);
        }
    })
});

module.exports = router;
