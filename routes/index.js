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

router.get('/checkouts/:id', function(req, res, next){
  transaction_id = req.params.id;

  gateway.transaction.find(transaction_id, function(err, transaction){
    res.render('checkouts/show', {transaction: transaction});
  });
});

module.exports = router;
