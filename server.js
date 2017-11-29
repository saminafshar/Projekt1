//Express einrichten
var express = require ('express');
var path = require ('path');
var app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');

//DB einrichten
mongoose.connect(config.database);
let db = mongoose.connection;

//Verbindung überprüfen
db.once('open', function(){
    console.log('Connected to MongoDB');
});

//DB überprüfen
db.on('error', function(err){
    console.log(err);
});

//View Engine Laden
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug' );

//Body-Parser einrichten
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//Öffentlichen Ordner mit statischen Dateien einbinden
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'css')));
app.use(express.static(path.join(__dirname,'bilder')));

//Express Session starten
app.use(session({
  secret: 'i bims',
  resave: true,
  saveUninitialized: true
}))

//Express Messages Verbindungen
app.use(require('connect-flash')());
app.use(function(req,res,next){
    res.locals.messages = require('express-messages')(req,res);
    next();
});

//Express Validator https://github.com/ctavan/express-validator/blob/master/README.md
app.use(expressValidator({
    errorFormatter : function(param,msg, value){
        var namespace = param.split('.')
        , root  = namespace.shift()
            , formParam = root;

            while(namespace.length) {
                formParam +='[' + namespace.shift() + ']';
            }
            return {
                param : formParam,
                msg : msg,
                value : value
            };
        }
}));

//Passport Konfiguration
require('./config/passport')(passport);
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


//Globale Variable um zu checken, ob man eingeloggt ist
app.get('*', function(req,res,next){
    res.locals.user = req.user || null;
    next();
});

//Modell einbringen
let Article = require('./models/article');

//Websever starten
app.listen (4000, function(){
    console.log('Server started on 3000');
});

//Routing Homepage
app.get('/', function(req, res){
    Article.find({}, function(err, articles){
        if(err) {
            console.log(err);
        } else {
            res.render('index', {
                title:'Telefonbuch',
                articles:articles
            });
        }
    });
})

//Routing Über uns
app.get('/ueberuns', function(req, res){
  res.render('ueberuns')
});

//Routing
let articles = require('./routes/articles');
let users = require('./routes/users');
let search = require ('./routes/search')
app.use('/users', users);
app.use('/articles', articles);
app.use('/search', search);



//NPM's die ich benutzt habe
//-express
//-mongodb
//-mongoose
//-body-parser
//-pug
//-bower -bootstrape, -jquery
//-express-session
//-express-messages
//-express-validator
//-connect-flash
//passport
//passport-local
//bcrypt
