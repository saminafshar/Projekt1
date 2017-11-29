const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Artikel Modell einbringen
let User = require('../models/user');

//Registrierungsseite
router.get('/register', function(req,res) {
    res.render('register');
});

//Registrierung
router.post('/register', function(req,res){
    const name = req.body.name;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    //Felder auf Eingabe überprüfen
    req.checkBody('name', 'Name wird benötigt').notEmpty();
    req.checkBody('username', 'Benutzername wird benötigt').notEmpty();
    req.checkBody('password', 'Passwort wird benötigt').notEmpty();
    req.checkBody('password2', 'Password stimmt nicht überein').equals(req.body.password);

    let errors = req.validationErrors();

    if(errors){
        res.render('register', {
            errors:errors
        });
    }   else{
        let newUser = new User ({
            name:name,
            username:username,
            password:password
        });

        //Verschlüsselung mit bcrypt https://github.com/kelektiv/node.bcrypt.js
        bcrypt.genSalt(10, function(err,salt){
            bcrypt.hash(newUser.password, salt, function(err, hash){
                if(err){
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save(function(err){
                    if(err){
                        console.log(err);
                        return;
                    }else {
                        req.flash('success', 'Registrierung abgeschlossen. Sie können sich nun einloggen.');
                        res.redirect('/users/login');
                    }
                });
            });
        });
    }
});


//Login Prozess http://www.passportjs.org/docs/
router.post('/login', function(req,res, next){
    passport.authenticate('local', {
        successRedirect:'/',
        failureRedirect:'/users/login',
        badRequestMessage: 'Geben Sie Ihre Daten ein',
        failureFlash: true
    })(req, res, next);
});

//Logout http://www.passportjs.org/docs/
router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'Sie haben sich erfolgreich ausgeloggt');

	res.redirect('/');
});

//Login Formular
router.get('/login',function(req,res){
    res.render('login');
});

module.exports = router;