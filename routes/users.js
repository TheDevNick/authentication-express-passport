const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

// user model
const User = require('../models/User')
// Login Page
router.get('/login', (req, res) => res.render('login'))

// Register Page
router.get('/register', (req, res) => res.render('register'))

// Register handle
router.post('/register', (req, res) => {
    const {name, email, password, password2} = req.body
    let errors = []

    // check required fields
    if(!name || !email || !password || !password2) {
        errors.push({msg: 'Please fill in all fields'})
    }

    // check that passwords match
    if(password !== password2) {
        errors.push({msg: 'Passwords do not match'})
    }

    // check pass length
    if(password.length < 6) {
        errors.push({msg: 'passowrd should be at least 6 characters'})
    }

    if(errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        // Validation passed
        User.findOne({email: email})
        .then(user => {
            if(user) {
                // user exists
                errors.push({msg: 'Email is already registerd'})
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                })
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                })

                // hash password
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err
                    // set password to hash
                    newUser.password = hash
                    // save usr
                    newUser.save()
                        .then(user => {
                            req.flash('success_msg', 'You are now registerd and can login')
                            res.redirect('/users/login')
                        })
                        .catch(err => console.log(err))
                }) )
            }
        })
    }
})

module.exports = router