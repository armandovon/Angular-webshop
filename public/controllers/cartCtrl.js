//Kontroller för Varukorgen och produktsidan
app.controller('cartCtrl', ['$scope', '$http', '$location', '$timeout', function($scope, $http, $location, $timeout){
    $scope.url = "/admin";
           //Variabler som behövs
           $scope.products = [];
           $scope.addedProducts = [];
           $scope.cart = [];
           $scope.sum = 1;
           $scope.total = 0;
           $scope.totalProducts = [{sum:0}];
           $scope.TP = 0;
   
           //Totalsumman för varukorgen
           $scope.totalPrice = 0;

           

            
/*********************************************************************************************************************************************************************************   
        FUNKTIONER FÖR VARUKORGEN
    
*********************************************************************************************************************************************************************************/   

    //Funktion för att spara i localStorage
    $scope.saveLocal = function(){
        localStorage.setItem("totalProducts", JSON.stringify($scope.totalProducts));    //Totalt antal produkter
        localStorage.setItem("products", JSON.stringify($scope.addedProducts));         //Vilka produkter som lagts till
        localStorage.setItem("totalPrice", JSON.stringify($scope.totalPrice));          //Totalpriset
    }//Slut funktion spara i localStorage   
    
    $scope.saveLocal();
    
        $scope.addedProducts = JSON.parse(localStorage.getItem("products"));
        $scope.cart = JSON.parse(localStorage.getItem("products")); 
        $scope.totalProducts = JSON.parse(localStorage.getItem("totalProducts"));
        $scope.totalPrice = JSON.parse(localStorage.getItem('totalPrice'));
    
    //Lägga till produkt i varukorgen
    $scope.addInCart = function($id, $name, $price, $url) {
            
        //Lägger till ett på totalen     
        $scope.total = $scope.totalProducts[0].sum + 1; 
        $scope.totalProducts[0].sum = $scope.total;
        $scope.totalPrice += $price;
                    
        //Tar reda på om produkten redan finns
        for(i=0; i<$scope.addedProducts.length; i++){
            //Om produkten redan finns ökas antalet (sum) med ett
            if($scope.addedProducts[i].id == $id){
                $scope.sum = $scope.addedProducts[i].sum + 1; 
                $scope.cart[i].sum = $scope.sum;
                $scope.addedProducts[i].sum = $scope.sum;
            
                //Så det inte läggs till dubletter
                $scope.dontAdd = true;                
            }
        }     
                    
        //Om produkten inte redan finns läggs den till
        if($scope.dontAdd != true){
            $scope.addedProducts.push({id:$id,name:$name,price:$price,url:$url,sum:$scope.sum});
            $scope.cart.push({id:$id,name:$name,price:$price,sum:$scope.sum});
        }
                    
        //Återstället variabler
        $scope.dontAdd = false;
        $scope.sum = 1;

        
        //spara i Localstorage
        $scope.saveLocal();

        //Lägg in informationen variabler
        $scope.cart = JSON.parse(localStorage.getItem("products"));
        $scope.totalProducts = JSON.parse(localStorage.getItem("totalProducts"));
        $scope.totalPrice = JSON.parse(localStorage.getItem('totalPrice'));
            
    }//Slut lägga till produkt
            
    //Ändra antalet produkter
    //Minska antalet
    $scope.removeOne = function($id){
        //Tar fram rätt produkt
        for(i=0; i<$scope.addedProducts.length; i++){
                        
            if($scope.addedProducts[i].id == $id){
                $scope.totalPrice = $scope.totalPrice - $scope.addedProducts[i].price;
                //Om antalet är mer än 1
                if($scope.addedProducts[i].sum > 1){
                    $scope.sum = $scope.addedProducts[i].sum - 1; 
                    $scope.cart[i].sum = $scope.sum;
                    $scope.addedProducts[i].sum = $scope.sum;                 
                }
                //Om det endast är en produkt kvar tas den bort från varukorgen
                else if($scope.addedProducts[i].sum == 1){
                    //Tar bort produkten
                    $scope.cart.splice(i, 1);
                    $scope.addedProducts.splice(i, 1);
                }  
                            
                //Tar bort 1 från totalen
                $scope.total = $scope.totalProducts[0].sum - 1; 
                $scope.totalProducts[0].sum = $scope.total;
                            
        
                //Återstället variabel
                $scope.sum = 1;
            
                //spara i Localstorage
                $scope.saveLocal();
            }
        }
    }//Slut minska antalet
            
    //Öka antalet
    $scope.addOne = function($id){
        //Tar fram rätt produkt med hjälp av id:t
        for(i=0; i<$scope.addedProducts.length; i++){
            if($scope.addedProducts[i].id == $id){
            
                //Lägger till 1 till summan
                $scope.sum = $scope.addedProducts[i].sum + 1;
                $scope.cart[i].sum = $scope.sum;
                $scope.addedProducts[i].sum = $scope.sum;
            
                //lägger till 1 till totalen
                $scope.total = $scope.totalProducts[0].sum + 1; 
                $scope.totalProducts[0].sum = $scope.total;
                $scope.totalPrice = $scope.totalPrice + $scope.addedProducts[i].price;
                           
                //Återstället variabel
                $scope.sum = 1;
            
                //spara i Localstorage
                $scope.saveLocal();
            }
        }
    }//Slut öka antalet
            
    //Rensa varukorgen
    $scope.clearCart = function(){
        $scope.addedProducts = [];
        $scope.cart = [];
        $scope.totalPrice = 0;                   
        $scope.totalProducts[0].sum = 0;

        //spara i Localstorage
        $scope.saveLocal();

    }//Slut rensa varukorgen
            
    //Ta bort särskild produkt
    $scope.removeProduct = function($id){
            
        for(i=0; i<$scope.addedProducts.length; i++){
            //Om id:t matchar tas produkten bort
            if($scope.addedProducts[i].id == $id){
            
                //Tar bort antalet från totalProducts
                $scope.total = $scope.addedProducts[i].sum;
                $scope.totalProducts[0].sum -= $scope.total;
                $scope.sum = 1;
        
                //Tar bort priset
                var x = $scope.total * $scope.addedProducts[i].price;
                $scope.totalPrice = $scope.totalPrice - x;
            
                //Tar bort produkten
                $scope.cart.splice(i, 1);
                $scope.addedProducts.splice(i, 1);
                         
            }
        }
            
        //spara i Localstorage
        $scope.saveLocal();
            
    }//Slut ta bort särskild produkt

    //Checkout
    $scope.checkout = function(){

        //Skickar användaren till checkout-sidan
        $location.path('/checkout');

        //Nollställer varukorgen efter en sekund
        $timeout(function(){
            $scope.clearCart();
        }, 1000);

    }//Slut checkout

    //Hämta produkter
    $http.get('/api/products').success(function(data){
            
        $scope.products = data;                 //Lägger in alla produkter i "products"
        $scope.id = $scope.products.length;     //Tar fram det senaste id:t

    });//Slut hämta produkter
            
            
}]);//Slut kontroller för Varukorgen och produktsidan