const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const path = require('path')
const dotenv = require('dotenv')
const passport = require('passport')
const session = require('express-session')
const User = require('./authentication/models/User')
const ActualTotalLoad = require('./ftpCommunication/models/ActualTotalLoad')
const AggregatedGenerationPerType= require('./ftpCommunication/models/AggregatedGenerationPerType')
const PhysicalFlows= require('./ftpCommunication/models/PhysicalFlows')

global.__basedir =__dirname+"/..";
// Load config
dotenv.config({path : './config/config.env'})

//Passport config
require('./config/passport')(passport)

//database
const db = require('./config/database');

// Test Database

db.authenticate()
    .then(()=> console.log('Database connected ...'))
    .catch(err => console.log('Error: '+ err))

// db.sync({force:true})
// db.sync()
// ActualTotalLoad.sync({force:true})
// User.sync({force:true})
// AggregatedGenerationPerType.sync({force:true})
// PhysicalFlows.sync({force:true})

const app = express();

//Handlebars
app.engine('.hbs', exphbs.engine({ defaultLayout: 'main',extname: '.hbs'}));
app.set('view engine', '.hbs');

// Session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}))

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Set static folder
app.use(express.static(path.join(__dirname,'public')));

//Parser
app.use(bodyParser.json());                        

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//Routes
// app.get('/',(req, res) => res.send('INDEX'));

app.use('/',require('./authentication/routes/index'))
app.use('/auth',require('./authentication/routes/auth'))
app.use('/communication',require('./ftpCommunication/routes/comm'))

app.use('/users',require('./authentication/routes/users'));

app.use('/renew',require('./update/routes/renew'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));