const express = require('express')
const expressLayoutes = require('express-ejs-layouts')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const morgan = require('morgan')
const app = express()

//DB config
const db = require('./config/keys').MongoURI

// connect to mongo
mongoose.connect(db, {useNewUrlParser: true})
    .then(() => console.log('MongoDB connected!'))
    .catch(err => console.log(err))

// EJS
app.use(expressLayoutes)
app.set('view engine', 'ejs')

// logging
app.use(morgan('dev'))

// bodyparser
app.use(express.urlencoded({ extended: false }))

// Express Session 
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }))

//   Connect  flash
app.use(flash())

// Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    next()
} )
// Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))


const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}..`);
})