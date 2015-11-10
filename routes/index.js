var express = require('express');
var router = express.Router();
var gateway = require('../lib/gateway');

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/checkouts/new', function(req, res, next) {
  gateway.clientToken.generate({}, function(err, response){
    res.render('index', { clientToken: response.clientToken});
  });

});
});

module.exports = router;
