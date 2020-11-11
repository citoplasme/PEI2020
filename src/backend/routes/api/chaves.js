var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var secretKey = require("./../../config/app");
var interfaceHosts = require("./../../config/database").interfaceHosts;
var Auth = require("../../controllers/auth");
var Chaves = require("../../controllers/api/chaves");
var Mailer = require("../../controllers/api/mailer");
const { param, header, body, query, validationResult } = require('express-validator');
const { existe, comecaPor, existeEnt } = require('../validation')

router.get("/", Auth.isLoggedInUser, Auth.checkLevel(6), (req, res) => {
  Chaves.listar(function(err, result) {
    if (err) {
      //res.status(500).send(`Erro: ${err}`);
      res.status(500).send("It was not possible to obtain the API keys.");
    } else {
      res.send(result);
    }
  });
});

router.get("/interfaceToken", [
    header('origin', "You cannot request from that domain.")
        .custom(value => interfaceHosts.includes(value))
], (req, res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
      return res.status(422).jsonp(errors.array())
  }
  
  Chaves.listarPorEmail("interface@template.com", function(err, chave) {
    if (err) {
      //res.status(500).send(`Erro: ${err}`);
      res.status(500).send("Error while obtaining the interface token.")
    } else if (!chave) {
      Chaves.criarChave(
        "interface",
        "interface@template.com",
        function(err, chave) {
          if (err) {
            //res.status(500).send(err);
            res.status(500).send("Error while obtaining the interface token.")
          } else {
            jwt.verify(chave.key, secretKey.apiKey, function(err, decoded) {
              if (err) {
                //res.status(500).send(err);
                res.status(500).send("Error while obtaining the interface token.")
              } else {
                res.send({ token: chave.key, exp: decoded.exp });
              }
            });
          }
        }
      );
    } else {
      jwt.verify(chave.key, secretKey.apiKey, function(err, decoded) {
        if (err) {
          Chaves.renovar(chave.id, function(err, chave) {
            if (err) {
              //res.status(500).send(err);
              res.status(500).send("Error while obtaining the interface token.")
            } else {
              jwt.verify(chave.key, secretKey.apiKey, function(err, decoded) {
                if (err) {
                  //res.status(500).send(err);
                  res.status(500).send("Error while obtaining the interface token.")
                } else {
                  res.send({ token: chave.key, exp: decoded.exp });
                }
              });
            }
          });
        } else {
          res.send({ token: chave.key, exp: decoded.exp });
        }
      });
    }
  });
});

router.get("/:id", Auth.isLoggedInUser, Auth.checkLevel(7), [
    param('id', "The API key does not contain a valid format.").isJWT()
], async function(req, res) {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
      return res.status(422).jsonp(errors.array())
  }

  await jwt.verify(req.params.id, secretKey.apiKey,async function(err, decoded){
    if (!err) {
      await Chaves.listarPorId(decoded.id, function(err, result) {
        if (err) {
          //res.status(403).send(err);
          res.status(500).send("Error while obtaining the token.")
        } else {
          res.send(result);
        }
      });
    } else {
      //res.status(403).send(err);
      res.status(500).send("Error while obtaining the token.")
    }
  });
});

router.post("/", [
    existe('body', 'name'),
    body('email', "Invalid email.").isEmail()
], (req, res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
      return res.status(422).jsonp(errors.array())
  }

  Chaves.listarPorEmail(req.body.email, function(err, chave) {
    if (err) {
      //return res.status(500).send(`Erro: ${err}`);
      return res.status(500).send("Error while registering the token.");
    }

    if (!chave) {
      Chaves.criarChave(
        req.body.name,
        req.body.email,
        function(err, result) {
          if (err) {
            //return res.status(500).send(`Erro: ${err}`);
            return res.status(500).send("Error while registering the token.");
          } else {
            Mailer.sendEmailRegistoAPI(req.body.email, result.ops[0].key);
            res.send("API key succesfully registered.");
          }
        }
      );
    } else {
      //Email já em uso
      //Por forma a não divulgar que emails estão já usados, será devolvido que foi enviado um email com sucesso
      res.send("API key succesfully registered.");
    }
  });
});

router.put("/renovar", [
    query('email', "Invalid email.").isEmail()
], function(req, res) {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
      return res.status(422).jsonp(errors.array())
  }

  Chaves.listarPorEmail(req.query.email, (err, chave) => {
    if (err) {
      //res.status(500).send(`Erro: ${err}`);
      res.status(500).send("Error while renewing the token.");
    } else {
      if (!chave) {
        //Chave API não encontrada (404)
        //Por forma a não divulgar que emails estão já usados
        res.status(500).send("Error while renewing the token.");
      } else {
        Chaves.renovar(chave._id, function(err, chaveRen) {
          if (err) {
            //res.status(500).send(`Erro: ${err}`);
            res.status(500).send(`Error while renewing the token.`);
          } else {
            res.jsonp({ apikey: chaveRen.key });
          }
        });
      }
    }
  });
});

router.put("/:id/desativar", Auth.isLoggedInUser, Auth.checkLevel(7), [
    param('id', "Id format is not valid.").isMongoId()
], function(req, res) {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
      return res.status(422).jsonp(errors.array())
  }

  Chaves.desativar(req.params.id, function(err, cb) {
    if (err) {
      //res.status(500).send(`Erro: ${err}`);
      res.status(500).send("Error while deactivating the token.");
    } else {
      res.send("API key sucessfully deactivated.");
    }
  });
});

router.put("/:id/ativar", Auth.isLoggedInUser, Auth.checkLevel(7), [
    param('id', "Id format is not valid.").isMongoId()
], function(req, res) {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
      return res.status(422).jsonp(errors.array())
  }

  Chaves.ativar(req.params.id, function(err, cb) {
    if (err) {
      //res.status(500).send(`Erro: ${err}`);
      res.status(500).send("Error while activating the token.");
    } else {
      res.send("API key successfully activated.");
    }
  });
});

router.delete("/:id", Auth.isLoggedInUser, Auth.checkLevel(7), [
    param('id', "Id format is not valid.").isMongoId()
], function(req, res) {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
      return res.status(422).jsonp(errors.array())
  }

  Chaves.eliminar(req.params.id, function(err, cb) {
    if (err) {
      //res.status(500).send(`Erro: ${err}`);
      res.status(500).send("Error while deleting the token.");
    } else {
      res.send("API key sucessfully deleted.");
    }
  });
});

router.put("/:id/atualizar", Auth.isLoggedInUser, Auth.checkLevel(7), [
    param('id', "Id format is not valid.").isMongoId(),
    existe('body', 'name'),
    body('contactInfo', "Invalid email.").isEmail()
], function(req, res) {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
      return res.status(422).jsonp(errors.array())
  }

  Chaves.listarPorEmail(req.body.email, function(err, chave) {
    if (chave && req.params.id != chave._id) {
      res.status(500).send("It was not possible to update the API key. There is an API key for that email.");
    } else {
      Chaves.atualizarMultiplosCampos(
        req.params.id,
        req.body.name,
        req.body.contactInfo,
        function(err, cb) {
          if (err) {
            //res.status(500).send(`Erro: ${err}`);
            res.status(500).send("Error while updating the token.");
          } else {
            res.send("API key sucessfully updated.");
          }
        }
      );
    }
  });
});

module.exports = router;
