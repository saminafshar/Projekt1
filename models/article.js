let mongoose = require('mongoose');

//Artikel Schema
let articleSchema = mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    author: {
        type:String,
        required:true
    },
    firm: {
        type:String,
        required:true
    },
    street: {
        type:String,
        required:true
    },
    housenumber: {
        type:String,
        required:true
    },
    zipcode: {
        type:String,
        required:true
    },
    city: {
        type:String,
        required:true
    },
    body: {
        type: String,
        required: true
    }
});

let Article = module.exports = mongoose.model('Article', articleSchema);