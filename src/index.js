const express = require('express');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const MySQLStore = require('express-mysql-session');
const {database} = require('./keys')


//inicializacion

const app = express();
require('./lib/passport');
app.use(express.static('public'))

//configuraciones

app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs',engine ({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

//middleware --> cada vez que un cliente envia una peticion al servidor

app.use(session({
    secret: 'proyectoSF2',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
  }));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//variables globales

app.use((req,rest,next) => {  //toma los datos que inf¡gresa el usuario, lo que responde el servidor y continua ejecutando con el nex
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
})

//rutas --> urls del servidor
app.use(require('./routes/'));
app.use(require('./routes/authentication'));
app.use('/seeds', require('./routes/seed'));


//archivos publicos --> codigo al que puede acceder el navegador

app.use(express.static(path.join(__dirname, 'public')));

//iniciar el servicor

app.listen(app.get('port'),() =>{
    console.log('Servidor en el puerto', app.get('port'));
});

