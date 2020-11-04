var Auth = require('../../controllers/auth.js');
var express = require('express');
var router = express.Router();

router.get('/', Auth.isLoggedInKey, (req, res) => {
//router.get('/', (req, res) => {    
    res.jsonp('Ola');
})

module.exports = router;