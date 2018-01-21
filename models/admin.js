//Skapad av Armando von Gohren (arvo1600)

//Schema för admin
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//DB-Schema
var adminSchema = new Schema({
    username: String,
    password: String,
    email: String
});

//Exportera schema
module.exports = mongoose.model('admin', adminSchema);