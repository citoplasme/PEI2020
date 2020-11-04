const ip = process.env.IP || 'localhost'
const port = process.env.PORT || '7779'
module.exports.apiVersion = process.env.API_VERSION || 'v1'

module.exports.host = 'http://'+ip+':'+port

module.exports.swaggerURL = process.env.SWAGGER_URL || this.host

module.exports.userDB = process.env.MONGODB ? 'mongodb://' + process.env.MONGODB + '/authtemplate' : 'mongodb://localhost/authtemplate'

module.exports.interfaceHosts = [
    "http://localhost:8080",
]
