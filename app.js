//Skapad av Armando von Gohren (arvo1600)

//Importera
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var multer = require('multer');
var nodemailer = require('nodemailer');

var file = require('file-system');
var fs = require('fs');

//Instans av express
var app = express();

//Middleware
app.all('/*', function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    next();
});


//Multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/products/');
    },
    filename: function (req, file, cb) {
        if(!file.originalname.match(/\.(png|PNG|jpg|JPG|jpeg|JPEG)$/)){
            var err = new Error();
            err.code = 'filetype';
            return cb(err);
        }else{
            cb(null, Date.now() + "_" + file.originalname);
        }     
    }
});

var upload = multer({ storage: storage, limits: {fileSize: 1000000} }).single('myfile');

//Statisk sökväg
app.use(express.static(path.join(__dirname, 'public')));

//Port
var port = process.env.PORT || 3000;

//Starta servern
app.listen(port, function(){
    console.log("Server startad på port " + port);
});

//Anslut till databasen
mongoose.connect('mongodb://dbAdmin:dbAdmin@ds135917.mlab.com:35917/webshop', {useMongoClient: true});
mongoose.promise = global.promise;

var db = mongoose.connection;

//Importera scheman
var admin = require('./models/admin');
var products = require('./models/products');

//Body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//Läs in inloggningsuppgifter
app.get('/api/loginDetails/:username/:password', function(req, res){

    //Användarnamn och lösenord
    var username = req.params.username;
    var password = req.params.password;

    //Letar efter objektet med valt användarnamn
    admin.find({username:username}, function(err, details){
        if(err){
            res.json(err);
        }else{

           //Om det inte existerar sätts login till false 
            if(details == ""){
                res.json({login: false});
            }else{
                
                //Rätt inloggningsuppgifter
                correctUsername = details[0].username;
                correctPassword = details[0].password;

                //Om man fyllt i rätt uppgifter sätts login till "true", annars till "false"
                if(correctUsername == username && correctPassword == password){
                    res.json({login: true});
                }else{
                    res.json({login: false});
                }
            }
            
            
        }
    });
});//Slut hitta användare

//Läs in alla produkter
app.get('/api/products', function(req, res){
    products.find(function(err, products){
        if(err){
            res.json(err);
        }else{
            res.json(products);
        }
    });  
});//Slut läsa in produkter


//Ladda upp bild med multer
app.post('/upload', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      if(err.code === 'filetype'){
          res.json({success: false, message: 'Filetype must be png, jpg or jpeg'});
      }else if(err.code === 'LIMIT_FILE_SIZE'){
        res.json({success: false, message: 'Max filesize is 1MB'});
      }
    }else{
        if(!req.file){
            res.json({success: false, message: 'No file selected'});
        }else{
            var path = req.file.path;
            res.json({success: true, message: 'File uploaded', path: req.file.path});      
        }
    }
  });
});


//Lägg till produkt
app.post('/api/products/add', function(req, res){

    var product = new products();

    product.name = req.body.name;
    product.price = req.body.price;
    product.id = req.body.id;
    product.url = req.body.url;

    //Spara i databasen
    product.save(function(err){
        if(err){
            res.json(err);
        }else{
            res.json({message: 'produkt tillagd!'});
        }
    });
});//Slut lägga till produkt

//Radera bild
app.delete('/api/products/delete/url/:url', function(req, res){
    //Bildens url
    var deleteUrl = "public\\products\\" + req.params.url;
    
    //Tar bort bilden
    fs.unlinkSync(deleteUrl);
});//Slut radera bild

//Radera produkt
app.delete('/api/products/delete/:id', function(req, res){

    //Produktens id
    var deleteId = req.params.id;

    //Raderar vald produkt
    products.deleteOne({id:deleteId}, function(err){
        if(err){
            res.json(err);
        }else{           
            res.json({message: "produkten är raderad"});
        }
    }); 
});//Slut radera produkt


//Uppdatera produkt
app.put('/api/products/update', function(req, res){

    //Produktens info
    var id = req.body.id;
    var name = req.body.name;
    var price = req.body.price;

    //Uppdaterar vald produkt
    products.update({id:id}, {$set : {"name": name, "price": price}}, function(err){
        if(err){
            res.json(err);
        }else{
            res.json({message: "produkten är uppdaterad!"});
        }
    });
});//Slut uppdatera produkt



