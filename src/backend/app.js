//Basic webserver
var express = require('express'),
    app = express();

//body parser for post requests
var bodyParser = require('body-parser')
app.use(bodyParser.json({limit: '50mb'}));         // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({
    limit : '50mb',
    // to support URL-encoded bodies
    extended: true,
    parameterLimit:50000
}));

//CORS
var cors = require('cors')
const corsOpts = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Accept', 'Authorization', 'Cache-Control', 'Content-Type', 'DNT', 'If-Modified-Since', 'Keep-Alive', 'Origin', 'User-Agent', 'X-Requested-With', 'Content-Length']
}
app.use(cors(corsOpts))
app.options('*', cors(corsOpts))

// Logging na consola do admin
var logger = require('morgan')

//Funcao auxiliar para contar numero de GET e POST
var Logs = require('./controllers/api/logs')
var aggregateLogs = require('./controllers/api/aggregateLogs')
var dataBases = require('./config/database');

app.use((req, res, next) => {
    res.on('finish', async () => {
        var route = Logs.getRoute(req)

        if(route){
            if(!res.locals.id || !res.locals.idType){
                res.locals.id = "Unknown"
                res.locals.idType = "Unknown"
            }
            
            Logs.newLog(route, req.method, res.locals.id, res.locals.idType, res.statusCode)
            route = route.match(/^\/[^/]*/)[0]
            try{
                aggregateLogs.newAggregateLog(route, req.method, res.locals.id, res.locals.idType)      
            }catch(err){
                console.log("Error adding the aggregated log: " + err)
            }
        }
    });
    next();
});

//authentication dependencies
var passport = require('passport');
require('./config/passport')(passport);

//config
app.use(express.static(__dirname + '/public'));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Logging middleware
app.use(logger('dev'))

// Connect mongo and mongoose
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//Como o emit não funciona (devolve false) caso não haja já um listener
//voltasse a tentar de 1 em 1 segundo por forma a avisar que o servidor
//já pode escutar visto que já está pronto
function emit(){
    if(!app.emit('ready')){
        setTimeout(emit(), 1000)
    }
}

mongoose.connect(dataBases.userDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    poolSize: 100 //max number of connections (default is 5)
})
    .then(async () => {
        var Mstate = mongoose.connection.readyState

        if(Mstate == 1){
            mongoose.connection.on('error', console.error.bind(console, 'MongoDB: error in the conection: '));

            console.log('MongoDB: ready. Status: ' + Mstate)
            
            //clean old logs
            Logs.removeOldLogs()
            //clean old logs periodically
            Logs.removeOldLogsPeriodically()

            //avisa que o servidor está pronto a receber pedidos
            emit()
        }else{
            console.error("MongoDB: unable to access.")
            process.exit(1)
        }
    })
    .catch(() => {
        console.error('MongoDB: unable to access.')
        process.exit(1)
    })

var mainRouter = express.Router()

//Swagger
const swaggerUi = require('swagger-ui-express');
const options = require('./config/swagger').options
mainRouter.use('/docs', swaggerUi.serve, swaggerUi.setup(null, options));

//routes and API
mainRouter.use('/users',require('./routes/api/users'));
mainRouter.use('/chaves',require('./routes/api/chaves'));
mainRouter.use('/auth', require('./routes/api/auth'));
mainRouter.use('/logsAgregados', require('./routes/api/aggregateLogs'));
mainRouter.use('/logs', require('./routes/api/logs'));
mainRouter.use('/parametros', require('./routes/api/parametros'));

mainRouter.use('/countries', require('./routes/api/countries'));
mainRouter.use('/locations', require('./routes/api/locations'));
mainRouter.use('/services', require('./routes/api/servicos'));

mainRouter.use('/categorias',require('./routes/api/categorias'));

mainRouter.use('/teste', require('./routes/api/teste'));

app.use('/' + dataBases.apiVersion, mainRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500).send(`${err.message}`);
});

module.exports = app; 
