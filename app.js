const path = require('path')
const express=require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan') // for logging purpuse
const connectDB = require('./config/db')
const expresshandlebars = require('express-handlebars') //templating engine 
const passport = require('passport') // package of node for different security strategy like google or twitter and so on
const session = require('express-session') //use for passport session 
const MongoStore = require('connect-mongo')(session)
//for load config file use below 
dotenv.config({path:'./config/config.env'})

//passport config
require('./config/passport')(passport) // here we are passing passport as argument for file in config/passport

connectDB()

const app = express()

//Body parser

app.use(express.urlencoded({extended:false}))
app.use(express.json())

//only run in development mode
if(process.env.NODE_ENV ==='development'){
    app.use(morgan('dev')) //for logging purpouse use morgan
}


//Handlebars Helpers
const {formatDate} = require('./helpers/hbs')
//for using template
app.engine('.hbs',expresshandlebars({helpers:{formatDate}, defaultLayout:'main',extname:'.hbs'}));
app.set('view engine','.hbs');

//use express-session
app.use(session({
    secret:'keyboard cat',
    resave:false, //dont save session if nothing modified
    saveUninitialized : false, 
    store:new MongoStore({mongooseConnection:mongoose.connection})
}))

//set passport middleweare
app.use(passport.initialize())
app.use(passport.session()) //in order to use session we need express-session package check package.json

//configure static folder
app.use(express.static(path.join(__dirname , 'public')));//__dirname is current directory

//Routes
app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'))
app.use('/stories',require('./routes/stories'))



const PORT = process.env.PORT || 3000
app.listen(PORT,console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))

//here for running development use "npm run dev" for running production use "npm start"