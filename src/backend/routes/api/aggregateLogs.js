var Auth = require('../../controllers/auth.js');
var AggregateLogs = require('../../controllers/api/aggregateLogs.js');
const { validationResult } = require('express-validator');
const { existe, estaEm, existeDep, vcTipoUser } = require('../validation')

var express = require('express');
var router = express.Router();

router.get('/', Auth.isLoggedInUser, Auth.checkLevel(6), [
    estaEm('query', 'tipo', vcTipoUser)
        .custom(existeDep("query", "id"))
        .withMessage("'id' is undefined, null or empty")
        .optional(),
    existe('query', 'id')
        .custom(existeDep("query", "tipo"))
        .withMessage("'tipo' is undefined, null or empty")
        .optional()
], (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).jsonp(errors.array())
    }
    
    if(req.query.id && req.query.tipo){
        AggregateLogs.getAggregateLog(req.query.id, req.query.tipo)
            .then(data => res.jsonp(data))
            .catch(error => res.status(500).send(`Error obtaining the aggregated logs of ${req.query.tipo} with id ${req.query.id}: ${error}`))
    }else{
        AggregateLogs.getAllAggregateLogs()
            .then(data => res.jsonp(data))
            .catch(error => res.status(500).send(`Error obtaining the aggregated logs: ${error}`))
    }
})

router.get('/rotas', Auth.isLoggedInUser, Auth.checkLevel(6), [
    existe('query', 'rota')
        .bail()
        .isURL({
            require_tld: false,
            require_host: false,
            require_valid_protocol: false
        })
        .withMessage("Route is invalid")
        .customSanitizer(decodeURIComponent)
        .optional()
], (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).jsonp(errors.array())
    }

    if(req.query.rota){
        AggregateLogs.getAggregateLogRoute(req.query.rota)
            .then(data => res.jsonp(data))
            .catch(error => res.status(500).send(`Error obtaining the aggregated logs of route ${req.query.rota}: ${error}`))
    }else{
        AggregateLogs.getAggregateLogRoutes()
            .then(data => res.jsonp(data))
            .catch(error => res.status(500).send(`Error obtaining the aggregated logs of the routes: ${error}`))
    }
})

router.get('/total', Auth.isLoggedInUser, Auth.checkLevel(6), (req, res) => {
    AggregateLogs.totalAggregateLogs()
        .then(data => res.jsonp(data))
        .catch(error => res.status(500).send(`Error obtaining the total number of API requests: ${error}`))
})

// Delete all agg logs
router.delete('/', Auth.isLoggedInUser, Auth.checkLevel(7), (req, res) => {
    AggregateLogs.deleteAllAggLogs()
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).send(`Error deleting the aggregated logs: ${erro}`));
})

module.exports = router;