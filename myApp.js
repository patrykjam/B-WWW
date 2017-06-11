var http = require("http");
var path = require("path");
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
var crypto = require('crypto');
var multer = require("multer");
var mime = require('mime');
var fs = require('fs');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/')
    },
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
        });
    }
});
var upload = multer({storage: storage});
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
    var User = require('./models/users');


    User.find({username: login}, function (err, user) {
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
    session = req.session;

    if (app.locals.users.length !== 0)
        return res.json({
            loggedIn: true, username: app.locals.users[0].username, dateOf: app.locals.users[0].reg_date,
            admin: app.locals.users[0].admin
        });
    else
        return res.json({loggedIn: false, admin: false});
});

app.get('/internal/tvs', function (req, res) {
    session = req.session;

    var Product = require('./models/products');

    Product.find({type: 'TV'}).sort('id').exec(function (err, products) {
        res.send(products);
    });
});

app.get('/internal/pcs', function (req, res) {
    session = req.session;

    var Product = require('./models/products');

    Product.find({type: 'PC'}).sort('id').exec(function (err, products) {
        res.send(products);
    });
});

app.get('/internal/products', function (req, res) {
    session = req.session;

    var Product = require('./models/products');

    Product.find({}).sort('id').exec(function (err, products) {
        res.send(products);
    });
});

app.post('/internal/add-comment', function (req, res) {
    session = req.session;

    var commentJson = req.body;
    // console.log(commentJson);
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
    session = req.session;

    var Comment = require('./models/comments');

    var pid = req.params.prodid;

    Comment.find({product_id: pid}).exec(function (err, comments) {
        res.send(comments);
    });
});

app.post('/internal/add-to-basket', function (req, res) {
    session = req.session;

    var json = req.body;
    var Basket = require('./models/basket');
    if (app.locals.users.length !== 0) {

        var newBasketItem = Basket({
            product_id: json.product_id,
            username: app.locals.users[0].username
        });

        newBasketItem.save(function (err) {
            if (err) throw err;
            console.log('Product added to basket!');
        })

    } else {
        res.send('404');
        console.log('Not logged in!');
        console.log(app.locals.users.length)
    }
});

app.get('/internal/get-basket', function (req, res) {
    session = req.session;

    var Basket = require('./models/basket');
    if (app.locals.users.length !== 0) {
        Basket.find({username: app.locals.users[0].username}).sort('id').exec(function (err, basket) {
            res.send(basket);
        });

    } else {
        res.send('[]');
        console.log('Not logged in!')
    }
});

app.post('/internal/remove-from-basket', function (req, res) {
    session = req.session;

    var bid = req.body.bid;

    var Basket = require('./models/basket');
    if (app.locals.users.length !== 0) {
        Basket.findOne({username: app.locals.users[0].username, id: bid}).exec(function (err, basket) {
            if (basket.length !== 0) {
                basket.remove(function (err) {
                    if (err) throw err;

                    console.log('Item successfully deleted!');
                });
            }

        });

    } else {
        res.send('[]');
        console.log('Not logged in!')
    }
});

app.post('/internal/remove-product', function (req, res) {
    session = req.session;

    var pid = req.body.product_id;

    var Basket = require('./models/basket');
    var Product = require('./models/products');
    var Comment = require('./models/comments');

    if (app.locals.users.length !== 0) {
        if (app.locals.users[0].admin) {

            Comment.remove({product_id: pid}).exec(function (err) {
                if (err) throw err;
            });

            Basket.remove({product_id: pid}).exec(function (err) {
                if (err) throw err;
            });

            Product.find({id: pid}).exec(function (err, product) {
                if (err) throw err;
                var imageFiles = product[0].images;
                var filePath;
                for (var j = 0; j < imageFiles.length; j++) {
                    filePath = 'public/' + imageFiles[j];
                    fs.unlinkSync(filePath);
                }

                Product.remove({id: pid}).exec(function (err) {
                    if (err) throw err;

                    console.log('Product removed!')
                });

            });
        } else {
            res.send('[]');
            console.log('Not logged in!')
        }
    } else {
        res.send('[]');
        console.log('Not logged in!')
    }
});
//TODO:: remove image files

app.post("/add-new-product", upload.array('imagefiles'), function (req, res) {
    var imageFiles = req.files;
    var badPhoto = false;
    var filePath;

    for (var i = 0; i < imageFiles.length; i++) {
        if (imageFiles[i].originalname.indexOf("jpeg") < 0 &&
            imageFiles[i].originalname.indexOf("jpg") < 0 &&
            imageFiles[i].originalname.indexOf("png") < 0) {
            res.redirect('/#/badPhoto');
            badPhoto = true;
            break;
        }
    }
    if (badPhoto) {
        for (var j = 0; j < imageFiles.length; j++) {
            filePath = 'public/images/' + imageFiles[j].filename;
            fs.unlinkSync(filePath);
        }
    } else {
        var Product = require('./models/products');

        var imagesArray = [];
        for (var q = 0; q < imageFiles.length; q++) {
            filePath = 'images/' + imageFiles[q].filename;
            imagesArray.push(filePath)
        }

        var newProduct = Product({
            name: req.body.name,
            specs: req.body.specification,
            type: req.body.type,
            images: imagesArray
        });

        newProduct.save(function (err) {
            if (err) throw err;
            console.log('Product added!');
        });
        res.redirect('/#/newProduct')
    }
});


app.listen(8080);
console.log("App listening on port 8080");