var loggedIn = false;
var username;
var dateOf;

app = angular.module("myapp", [
    'ngRoute'
    , 'ngSanitize'
]);

app.config(function ($routeProvider) {
    $routeProvider

    // route for the home page
        .when('/', {
            templateUrl: 'pages/Home.html',
            controller: 'homeController'
        })

        // route for the about page
        .when('/contact', {
            templateUrl: 'pages/Kontakt.html',
            controller: 'contactController'
        })

        // route for the contact page
        .when('/shopInfo', {
            templateUrl: 'pages/Sklep.html',
            controller: 'shopController'
        })

        .when('/laptops', {
            templateUrl: 'pages/Laptopy.html'
        })

        .when('/tvs', {
            templateUrl: 'pages/Telewizory.html'
        })

        .when('/register', {
            templateUrl: 'pages/Register.html',
            controller: 'registerController'
        })

        .when('/badRegister', {
            templateUrl: 'pages/Register.html',
            controller: 'invalidRegisterController'
        })

        .when('/login', {
            templateUrl: 'pages/Login.html',
            controller: 'loginController'
        })

        .when('/badLogin', {
            templateUrl: 'pages/Login.html',
            controller: 'invalidLoginController'
        })

        .when('/goodRegister', {
            templateUrl: 'pages/Login.html',
            controller: 'newLoginController'
        })

        .when('/panel', {
            templateUrl: 'pages/Panel.html',
            controller: 'panelController',
            auth: loggedIn
        })

    // .otherwise()
    ;

});

app.controller("mainController", function ($scope, $http) {


    var notLoggedHtml = '<ul class="nav navbar-nav navbar-right">' +
        '<li>' +
        '<a href="#register"><span class="glyphicon glyphicon-user"></span> Rejestracja</a>' +
        '</li>' +
        '<li>' +
        '<a href="#login"><span class="glyphicon glyphicon-log-in"></span> Logowanie</a>' +
        '</li>' +
        '</ul>';

    var loggedInHtml = '<ul class="nav navbar-nav navbar-right">' +
        '<li>' +
        '<a href="#basket"><span class="glyphicon glyphicon-shopping-cart"></span> Koszyk</a>' +
        '</li>' +
        '<li>' +
        '<a href="#panel"><span class="glyphicon glyphicon-user"></span> Panel</a>' +
        '</li>' +
        '<li>' +
        '<a href="/logout"><span class="glyphicon glyphicon-log-out"></span> Wylogowanie</a>' +
        '</li>' +
        '</ul>';

    $http.get("/internal/loggedIn").success(function (data) {
        if (data.loggedIn === false) {
            loggedIn = false;
            $scope.message = notLoggedHtml;
        } else {
            loggedIn = true;
            $scope.message = loggedInHtml;
            username = data.username;
            dateOf = data.dateOf;
        }
    });

    $scope.menus = [
        {
            title: "Strona główna",
            action: "#/"
        },
        {
            title: "O sklepie",
            action: "#shopInfo"
        },
        {
            title: "Katalog",
            action: "nothing",
            menus: [
                {
                    title: "Laptopy",
                    action: "#laptops"
                },
                {
                    title: "Telewizory",
                    action: "#tvs"
                }
            ]
        },
        {
            title: "Kontakt",
            action: "#contact"
        }
    ]
});

// create the controller and inject Angular's $scope
app.controller('homeController', function ($scope) {
    $scope.message = 'HOME';
});

// create the controller and inject Angular's $scope
app.controller('contactController', function ($scope) {
    $scope.message = 'KONTAKT';
});

app.controller('shopController', function ($scope) {
});

app.controller('loginController', function ($scope) {
    $scope.message = '';
});

app.controller('invalidLoginController', function ($scope) {
    $scope.message = 'Zły login lub hasło';
});

app.controller('registerController', function ($scope) {
    $scope.message = '';
});

app.controller('invalidRegisterController', function ($scope) {
    $scope.message = 'Zły login lub hasło';
});

app.controller('newLoginController', function ($scope) {
    $scope.message = 'Rejestracja pomyślna!';
});

app.controller('panelController', function ($scope) {
    if (!loggedIn)
        $scope.message = '<h1>ZALOGUJ SIĘ!</h1>';
    else {
        $scope.message = '<h1>Panel</h1> <h3>Nazwa użytkownika: </h3>' +
            ' <p>' + username + '</p> ' +
            '<h3>Użytkownik od: </h3>' +
            ' <p>' + dateOf + '</p>';
    }
});

$(document).ready(function () {
});