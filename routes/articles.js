const express = require('express');
const router = express.Router();

//Artikel Modell einbringen
let Article = require('../models/article');

//User Modell einbringen
let User = require('../models/user');

//Add Route hinzufügen
router.get('/add',ensureAuthenticated, function(req,res){
    res.render('add_article', {
        title:'Eintrag hinzufügen'
    });
});

//Artikel speichern
router.post('/add',ensureAuthenticated, function(req,res){
    req.checkBody('title', 'Titel muss hinzugefügt werden').notEmpty();
    //req.checkBody('author', 'Author muss hinzugefügt werden').notEmpty(); -- wird automatisch übernommen
    req.checkBody('street', 'Straße muss hinzugefügt werden').notEmpty();
    req.checkBody('housenumber', 'Hausnummer muss hinzugefügt werden').notEmpty();
    req.checkBody('zipcode', 'Postleitzahl muss hinzugefügt werden').notEmpty();
    req.checkBody('city', 'Stadt muss hinzugefügt werden').notEmpty();

    //Fehlermeldungen
    let errors = req.validationErrors();

    if (errors) {
        res.render('add_article', {
            title:'Add Article',
            errors:errors
        });
    }  else {
        let article = new Article();
        article.title = req.body.title;
        article.author = req.user._id;
        article.firm = req.body.firm;
        article.street = req.body.street;
        article.housenumber = req.body.housenumber;
        article.zipcode = req.body.zipcode;
        article.city = req.body.city;
        //article.body = req.body.body;
    
        article.save(function(err){
            if(err){
                console.log(err);
                return;
            }   else {
                req.flash('success','Artikel hinzugefügt');
                res.redirect('/');
            }
        });
    }
});

//Bearbeiten Route hinzufügen
router.get('/edit/:id',ensureAuthenticated, function(req,res) {
    Article.findById(req.params.id, function(err, article){
        if(article.author!=req.user._id) {
            req.flash('danger', 'Nicht authorisiert!')
            res.redirect('/');
        }
        res.render('edit_article',{
            title:'Artikel bearbeiten',
            article:article
        })
    });
});

//Artikel bearbeiten
router.post('/edit/:id', function(req,res){
    req.checkBody('title', 'Titel muss hinzugefügt werden').notEmpty();
    req.checkBody('street', 'Straße muss hinzugefügt werden').notEmpty();
    req.checkBody('housenumber', 'Hausnummer muss hinzugefügt werden').notEmpty();
    req.checkBody('zipcode', 'Postleitzahl muss hinzugefügt werden').notEmpty();
    req.checkBody('city', 'Stadt muss hinzugefügt werden').notEmpty();
    //req.checkBody('author', 'Author muss hinzugefügt werden').notEmpty(); -- wird automatisch übernommen

    //Fehlermeldungen
    let errors = req.validationErrors();
    
    if (errors) {
        res.render('edit_article', {
            title:'Artikel bearbeiten',
            errors:errors,
            article:Article.findById(req.params.id)
        });
    }  else {
        let article = {};
        article.title = req.body.title;
        //article.author = req.body.author; -- wird automatisch übernommen
        article.street = req.body.street;
        article.housenumber = req.body.housenumber;
        article.zipcode = req.body.zipcode;
        article.city = req.body.city;
        article.body = req.body.body;

        let query = {_id:req.params.id};
        console.log(req.params.id);
        Article.update(query, article, function(err){
            if(err){
                console.log(err);
                return;
            }   else {
                req.flash('success', 'Artikel geändert')
                res.redirect('/');
            }
        });
}});


router.delete('/:id', function(req,res){
    let query = {_id:req.params.id};

    Article.remove(query, function(err){
        if(err){
            console.log(err);
        }
        res.send('Success');
    });
});

//Einzelnen Artikel aufrufen
router.get('/:id', function(req,res) {
    Article.findById(req.params.id, function(err, article){
        User.findById(article.author, function(err,user){
            res.render('article',{
                article:article,
                author:user.name
            });
        });
     });
});

//Zugriffskontrolle
function ensureAuthenticated (req,res,next){
    if(req.isAuthenticated()) {
        return next();
    }   else{
        req.flash('danger', 'Bitte einloggen');
        res.redirect('/users/login');
    }
}

module.exports = router;