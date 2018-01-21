//Skapad av Armando von Gohren (arvo1600)

//Schema för produkter
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//DB-Schema
var productSchema = new Schema({
    name: String,
    price: Number,
    id: Number,
    url: String
});

//Exportera schema
module.exports = mongoose.model('products', productSchema);