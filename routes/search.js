const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

//Artikel Modell einbringen
let Article = require('../models/article');

//Search Route hinzufügen
router.get('/search', function(req,res){
    res.render('searchmain', {
        title:'Suchen'
    });
});

//Search Anfrage bearbeiten
router.post('/search', function(req,res){
    let search = req.body.search;
    Article.find({$or: [{title:{'$regex' : search, '$options' : 'i'}},
        {body:{'$regex' : search, '$options' : 'i'}},
        {firm:{'$regex' : search, '$options' : 'i'}},
        {street:{'$regex' : search, '$options' : 'i'}},
        {housenumber:{'$regex' : search, '$options' : 'i'}},
        {zipcode:{'$regex' : search, '$options' : 'i'}},
        {city:{'$regex' : search, '$options' : 'i'}}]},
        function (err, articles){
        if(err) throw(err)
        res.render('result',{
            articles:articles
        });
    });
});



module.exports = router;
