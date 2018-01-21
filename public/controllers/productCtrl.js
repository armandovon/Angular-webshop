//Controller för att Admin (inloggning och produkter)
app.controller('adminController', ['$scope', '$http', 'uploadFile', '$timeout', '$location', '$cookieStore',  function($scope, $http, uploadFile, $timeout, $location, $cookieStore){
    
    //variabel för bildens url
    $scope.file = {};
            
    //Variabler som behövs
    $scope.products = [];
    $scope.error = "";

    //Hämtar login-cookien
    var login = $cookieStore.get('login');

    //Login funktion
    $scope.login = function(username, password){

        $http.get('/api/loginDetails/'+username+'/'+password).success(function(data){

            //Om anv + lösen är rätt loggas personen in, annars skrivs felmeddelande ut
            if(data.login){
                $cookieStore.put('login','yes');
                $scope.error = "";
                $location.path('/admin');
            }else{
                $cookieStore.put('login','no');
                $scope.error = "Wrong username or password";
            }
        });
    }//Slut login

    //Logga ut
    $scope.logout = function(){
        $cookieStore.put('login','no');
        $location.path('/login');
    }
   
    //Om man inte är inloggad blir man skickad till inloggningssidan
    if(login == 'no'){
        $location.path('/login');
    }


    
    /*********************************************************************************************************************************************************************************   
        HÄMTA-, LÄGGA TILL-, ÄNDRA- OCH RADERA PRODUKTER
    
    *********************************************************************************************************************************************************************************/   
    
        //Hämta produkter
        $http.get('/api/products').success(function(data){
           
            $scope.products = data;                 //Lägger in alla produkter i "products"
            $scope.id = $scope.products.length;     //Tar fram det senaste id:t
        });//Slut hämta produkter

        //Ändra förhandsvisningsbilden
        $scope.photoChanged = function(files){
            if(files.length > 0 && files[0].name.match(/\.(png|PNG|jpg|JPG|jpeg|JPEG)$/)){
                $scope.uploading = true;
                var file = files[0];
                var fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onload = function(e){
                    $timeout(function(){
                        $scope.thumbnail = {};
                        $scope.thumbnail.dataUrl = e.target.result;
                        $scope.uploading = false;
                        $scope.message = false;
                    });
                }
            }else{
                $scope.thumbnail = {};
                $scope.message = 'Filetype must be png, jpg or jpeg';
                $scope.alert = 'alert alert-danger';
            }
        }

        //Lägga till en produkt
        $scope.Submit = function($name, $price){
            //Kontrollerar så att alla fält är ifyllda 
            if(!$name){                
                $scope.error = "You need to enter a name";
                $scope.alert = "alert-danger";
            }else if(!$price){
                $scope.error = "You need to enter a price";
                $scope.alert = "alert-danger";
            }else{
                $scope.uploading = true;
                uploadFile.upload($scope.file).then(function(data){
                    //Om bilden kunde laddas upp läggs all data in i databasen
                    if(data.data.success){                  
        
                        $scope.uploading = false;
                        $scope.alert = 'alert alert-success';
                        $scope.message = "File uploaded!";
    
                        //sparar bildens url samt tar bort de första sju bokstäverna (public/) för att få korrekt url
                        $scope.path = data.data.path;
                        $scope.path = $scope.path.substr(7);
    
                        //Nollställer file
                        $scope.file = {};
        
                        //Tar fram hur många produkter det finns
                        var nrOfItems = $scope.products.length - 1;

                        //Tar fram nästa id
                        if(nrOfItems < 0){
                            $scope.id = 0;
                        }else{
                            var lastID = $scope.products[nrOfItems].id;
                            $scope.id = lastID + 1;
                        }
                        
                
                        //Lägg till produkt
                        $http.post('/api/products/add', {
                            name: $name,
                            price: $price,
                            id: $scope.id,
                            url: $scope.path
                        }).success(function(){
                            console.log("Produkt Tillagd..");
                        });

                
                        }else{
                            $scope.uploading = false;
                            $scope.alert = 'alert alert-danger';
                            $scope.message = data.data.message;
                            $scope.file = {};
                        }
                    });       
               
                }   
                        
            };//Slut lägga till produkt
    
        //Ändra produkt
        $scope.updateProduct = function($id, $name, $price){

            //Nollställer message
            $scope.message = "";

            //Kontrollerar så att alla fält är ifyllda 
            if(!$id){
                $scope.error = "You need to enter an ID";
                $scope.alert = "alert-danger";
            }else if(!$name){                
                $scope.error = "You need to enter a name";
                $scope.alert = "alert-danger";
            }else if(!$price){
                $scope.error = "You need to enter a price";
                $scope.alert = "alert-danger";
            }else{

                //Kontrollerar så att ID:t finns
                for(i=0; i<$scope.products.length; i++){
                    if($scope.products[i].id == $id){
                        var exist = true;
                    }
                }//Slut kontroll ID

                //Om ID:t finns uppdateras produkten, annars skrivs felmeddelande ut
                if(exist == true){
                    $http.put('/api/products/update', {
                        id: $id,
                        name: $name,
                        price: $price
                    }).success(function(){
                        console.log("Produkt uppdaterad");
                        $scope.message = "Product updated!";
                        $scope.alert = 'alert alert-success';
                        $scope.error = "";
                        exist = false;
                    }); 
                }else{
                    $scope.error = "That ID doesn't exist";
                    $scope.alert = "alert-danger";
                }
                             
            }
    
        }//Slut ändra produkt

        //Radera produkt
        $scope.deleteProduct = function($id, $url){

            //Raderar produkt
            $http.delete('/api/products/delete/' + $id).success(function(){
                console.log("Produkten raderad!");
            });

            
            //Tar bort "products\" för att adressen inte ska bli fel
            $url = $url.substr(9);
            
            //Raderar bild
            $http.delete('/api/products/delete/url/' + $url).success(function(){
                console.log("Bilden raderad!");
            });

            //Hämta produkter
            $http.get('/api/products').success(function(data){
                
                $scope.products = data;                 //Lägger in alla produkter i "products"
                $scope.id = $scope.products.length;     //Tar fram det senaste id:t
            });//Slut hämta produkter

        }//Slut radera produkt
    
    }]);//Slut controller för att hämta/lägga till/uppdatera/radera produkter