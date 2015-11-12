var express = require('express');
var router = express.Router();
var gateway = require('../lib/gateway');

function formatErrors (errors) {
  formattedErrors = '';
  for (var i in errors) {
    formattedErrors += errors[i].code + " - " + errors[i].message + "\n";
  }
  return formattedErrors;
}

router.get('/', function(req, res, next) {
  res.redirect('/checkouts/new');
});

router.get('/checkouts/new', function(req, res, next) {
  gateway.clientToken.generate({}, function(err, response){
    res.render('checkouts/new', { clientToken: response.clientToken, messages: req.flash('error')});
  });
});

router.get('/checkouts/:id', function(req, res, next){
  transaction_id = req.params.id;

  gateway.transaction.find(transaction_id, function(err, transaction){
    res.render('checkouts/show', {transaction: transaction});
  });
});

router.post('/checkouts', function(req, res, next){
  amount = req.body.amount; // In production you should not take amounts directly from clients
  nonce = req.body.payment_method_nonce;

  gateway.transaction.sale({
    amount: amount,
    paymentMethodNonce: nonce,
  }, function(err, result){
    if (result.success) {
      res.redirect('checkouts/' + result.transaction.id)
    } else {
      var transactionErrors = result.errors.deepErrors();
      req.flash('error', { msg: formatErrors(transactionErrors) });
      res.redirect('checkouts/new')
    }
  });
});


module.exports = router;
