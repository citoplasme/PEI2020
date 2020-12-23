const { oneOf, check, param, query, body, header, cookie } = require('express-validator');

const getLocation = {
    'param': param,
    'query': query,
    'body': body,
    'header': header,
    'cookie': cookie
}

module.exports.existe = function (location, field){
    const msg = 'Value is undefined, null or empty'

    try{
        return getLocation[location](field, msg).exists({checkFalsy: true})
    }catch(err){
        return check(field, msg).exists({checkFalsy: true})
    }
}

module.exports.estaEm = function (location, field, list){
    var strList = list.map(v => "'" + v + "'")
    strList = strList.slice(0, -1).join(", ") + ' and ' + strList.slice(-1)
    const msg = "Value is not " + strList

    return module.exports.existe(location, field)
        .isIn(list)
        .withMessage(msg)
}

module.exports.comecaPor = function (location, field, starts){
    const msg = `Value does not start with '${starts}'`

    return module.exports.existe(location, field)
        .bail()
        .custom(value => value.startsWith(starts))
        .withMessage(msg)
}

module.exports.match = function(location, field, regex, ifF){
    const msg = `Invalid format, please follow the regex: '${regex}'`
    ifF = ifF || undefined

    return module.exports.existe(location, field, ifF)
        .bail()
        .matches(new RegExp(regex))
        .withMessage(msg)
}

module.exports.eExpiresTime = function(location, field, ifF){
    ifF = ifF || undefined
    var regex = '^\\d+(ms|s|m|h|d|y)$'
    return module.exports.match(location, field, regex, ifF)
}

module.exports.existeDep = function (location, fieldDep) {
    return function (v, { req }) {
      const loc = location + (location.slice(-1) == "y" ? "" : "s");
      if (!req[loc][fieldDep]) {
        return Promise.reject();
      } else {
        return Promise.resolve();
      }
    };
  };

module.exports.eMongoId = function (location, field, ifF) {
    ifF = ifF || undefined;
    return module.exports
      .existe(location, field, ifF)
      .bail()
      .isMongoId()
      .withMessage("Invalid id format");
};

module.exports.dataValida = function (location, field, ifF) {
    ifF = ifF || undefined;
    return module.exports
      .existe(location, field, ifF)
      .bail()
      .matches(/^\d{4}-\d{2}-\d{2}$/) //garante formato da data
      .withMessage("The date must follow the format: AAAA-MM-DD")
      .bail()
      .isISO8601({ strict: true }) //garante formato(mais flexivel) e se a data é válida
      .withMessage("The date is invalid");
  };

  module.exports.horaValida = function (location, field, ifF) {
    ifF = ifF || undefined;
    return module.exports
      .existe(location, field, ifF)
      .bail()
      .matches(/^\d{2}:\d{2}$/) //garante formato da data
      .withMessage("The hour must be in the format: HH:MM")
      .bail()
      .withMessage("The hour is invalid");
  };  

// Services
module.exports.vcServiceStatus = [-2, -1, 0, 1, 2, 3, 4]

/*
Monitoring actions
  1 - GET number of services by status globally or by user
  2 - GET total of services globally or by user
  3 - GET number of clients, service_providers and admins
  4 - GET number of service providers by category
  5 - GET number of service providers by specialization
  6 - GET number of clients associated to a service provider
  7 - GET services of a service provider with status 2,3 and 4
  */
module.exports.monitoringActions = [1, 2, 3, 4, 5, 6, 7]

//Users
module.exports.vcUserLevels = [-1, 1, 2, 3, 3.5, 4, 5, 6, 7]
module.exports.vcUsersFormato = ["normalizado"]

//Parametros
module.exports.vcParametrosExpires = [
    'userExpires',
    'keyExpires'
]

// AggregateLogs & Logs
module.exports.vcTipoUser = ["User", "Key", "Unknown"];
module.exports.vcVerbo = ["GET", "POST", "PUT", "DELETE"];


module.exports.vcParametros = module.exports.vcParametrosExpires.concat([
    //adicionar mais parametros caso seja necessário
])