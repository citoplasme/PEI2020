const ip = process.env.IP || 'localhost' // IP da máquina onde corre
const port = process.env.PORT || '7779'
module.exports.apiVersion = process.env.API_VERSION || 'v1'

module.exports.host = 'http://'+ip+':'+port

module.exports.swaggerURL = process.env.SWAGGER_URL || this.host //  || 'http://' + ip + ":" + this.port 

module.exports.userDB = process.env.MONGODB ? 'mongodb://ADMIN:ADMIN@' + process.env.MONGODB + '/authtemplate' : 'mongodb://localhost/authtemplate'

module.exports.interfaceHosts = [
    "http://frontend:8080",
    "http://localhost:8080",
    "http://localhost:50300"
    // "https://servicify.di.uminho.pt",
]
