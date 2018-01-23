//Skapad av Armando von Gohren (arvo1600)

//Module
var app = angular.module('myApp', ['ngRoute', 'ngStorage', 'fileModelDirective', 'uploadFileService', 'ngCookies']);

//Routeprovider
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "home.html",
        controller: "cartCtrl"
    })
    .when("/products", {
        templateUrl : "products.html",
        controller: "cartCtrl"
    })
    .when("/cart", {
        templateUrl : "cart.html",
        controller: "cartCtrl"
    }).when("/admin", {
        templateUrl : "upload.html",
        controller : "adminController"
    }).when("/login", {
        templateUrl : "login.html",
        controller : "adminController"
    }).when("/shipping", {
        templateUrl : "shipping.html",
        controller : "cartCtrl"
    }).when("/checkout", {
        templateUrl : "checkout.html",
        controller : "cartCtrl"
    });
});

//Tar fram rätt formulär
$("#onClick").on('click', function(){
    if($('#newProductForm').is(':hidden')){
        $("#newProductForm").show();
        $("#onClick").html("Hide form");
    }else{
        $("#newProductForm").hide();
        $("#onClick").html("Add-/Update product");      
    }
  
});
