var http = require("http");
var path = require("path");
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
var crypto = require('crypto');
// var multer = require("multer")
// var upload = multer({dest: 'uploads/'})
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var app = express();

var session = require("express-session");

mongoose.connect('mongodb://bwww:bwww@ds163711.mlab.com:63711/b-www');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

autoIncrement.initialize(db);


app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(logger('dev'));
app.use(bodyParser.urlencoded({'extended': 'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json

app.locals.users = [];
app.locals.flag = false;


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

app.post("/login", function (req, res) {

    session = req.session;

    var login = req.body.username;
    var password = req.body.password;
    console.log(login);
    console.log(password);
    var User = require('./models/users');


    User.find({username: login}, function (err, user) {
        console.log("login " + login);
        if (err) throw err;
        // object of the user
        if (user.length === 0) {
            res.redirect('/#/badLogin')
        } else {
            var hash = crypto.createHash('sha256');
            hash.update(password);
            if (hash.digest('hex') === user[0].password) {
                app.locals.users = user;
                res.redirect('/#');
                // res.sendFile(__dirname + '/public/index.html')
            }
            else
                res.redirect('/#/badLogin')
        }
    });
});

app.get("/logout", function (req, res) {

    session = req.session;
    app.locals.users = [];
    res.redirect('/#');

});

app.post("/register", function (req, res) {

    session = req.session;

    var login = req.body.username;
    var password = req.body.password;
    var User = require('./models/users');

    User.find({username: login}, function (err, user) {
        console.log("login " + login);
        if (err) throw err;
        // object of the user
        if (user.length === 0) {
            if (login === '' || password === '')
                res.redirect('/#/badRegister');
            else {

                var hash = crypto.createHash('sha256');
                hash.update(password);
                var pwd = hash.digest('hex');
// create a new user
                var newUser = User({
                    username: login,
                    password: pwd,
                    admin: false,
                    reg_date: new Date().toLocaleString()
                });

// save the user
                newUser.save(function (err) {
                    if (err) throw err;
                    console.log('User created!');
                });

                res.redirect('/#goodRegister');
            }
        } else {
            res.redirect('/#/badRegister')
        }
    });
});

app.get('/internal/loggedIn', function (req, res) {
    if (app.locals.users.length !== 0)
        return res.json({loggedIn: true, username: app.locals.users[0].username, dateOf: app.locals.users[0].reg_date});
    else
        return res.json({loggedIn: false});
});

app.get('/internal/tvs', function (req, res) {

    var Product = require('./models/products');

    Product.find({type: 'TV'}).sort('id').exec(function (err, products) {
        res.send(products);
    });
});

app.get('/internal/pcs', function (req, res) {

    var Product = require('./models/products');

    Product.find({type: 'PC'}).sort('id').exec(function (err, products) {
        res.send(products);
    });
});

app.post('/internal/add-comment', function (req, res) {

    var commentJson = req.body;
    console.log(commentJson);
    var Comment = require('./models/comments');

    var newComment = Comment({
        product_id: commentJson.product_id,
        comment: commentJson.comment,
        author: commentJson.author
    });

    newComment.save(function (err) {
        if (err) throw err;
        console.log('Comment added!');
    });
});

app.get('/internal/get-comments/:prodid', function (req, res) {

    var Comment = require('./models/comments');

    var pid = req.params.prodid;

    Comment.find({product_id: pid}).exec(function (err, comments) {
        res.send(comments);
    });
});


app.listen(8080);
console.log("App listening on port 8080");