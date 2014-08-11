// BASE SETUP
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Bear = require('./app/models/bear');
mongoose.connect('mongodb://localhost:27017/bearData');
app.use(bodyParser());
var port = process.env.PORT || 8080; // set our port


// ROUTES FOR OUR API


var router = express.Router();
router.use(function(req, res, next) {
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});
router.get('/', function(req, res) {
    res.json({
        message: 'hooray! welcome to our api!'
    });
});
router.route('/bears')
    .post(function(req, res) {
        console.log('coming post.');
        var bear = new Bear();
        bear.name = req.body.name;
        bear.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'Bear created!'
            });
        });
    })
    .get(function(req, res) {
        Bear.find(function(err, bears) {
            if (err)
                res.send(err);

            res.json(bears);
        });
    });


router.route('/bears/:bear_id')
    .get(function(req, res) {
        Bear.findById(req.params.bear_id, function(err, bear) {
            if (err)
                res.send(err);
            res.json(bear);
        });
    })
    .put(function(req, res) {
        Bear.findById(req.params.bear_id, function(err, bear) {
            if (err)
                res.send(err);
            bear.name = req.body.name; // update the bears info
            bear.save(function(err) {
                if (err)
                    res.send(err);

                res.json({
                    message: 'Bear updated!'
                });
            });

        });
    })
    .delete(function(req, res) {
        Bear.remove({
            _id: req.params.bear_id
        }, function(err, bear) {
            if (err)
                res.send(err);

            res.json({
                message: 'Successfully deleted'
            });
        });
    });
app.use(router);
app.listen(port);
console.log('Magic happens on port ' + port);