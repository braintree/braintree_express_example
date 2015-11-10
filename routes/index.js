var express = require('express');
var router = express.Router();
var gateway = require('../lib/gateway');

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/checkouts/new', function(req, res, next) {
  var checkoutsController = this;

  gateway.clientToken.generate({}, function(err, response){
    checkoutsController.clientToken = response.clientToken;
  });

  res.render('index', { clientToken: checkoutsController.clientToken });
});

module.exports = router;
