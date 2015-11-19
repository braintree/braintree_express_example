'use strict';

var express = require('express');
var router = express.Router(); // eslint-disable-line new-cap
var gateway = require('../lib/gateway');

function formatErrors(errors) {
  return errors.map(function (err) {
    return err.code + ' - ' + err.message;
  }).join('\n');
}

router.get('/', function (req, res) {
  res.redirect('/checkouts/new');
});

router.get('/checkouts/new', function (req, res) {
  gateway.clientToken.generate({}, function (err, response) {
    res.render('checkouts/new', {
      clientToken: response.clientToken,
      messages: req.flash('error')
    });
  });
});

router.get('/checkouts/:id', function (req, res) {
  var transactionId = req.params.id;

  gateway.transaction.find(transactionId, function (err, transaction) {
    res.render('checkouts/show', {
      transaction: transaction,
      messages: req.flash('error')
    });
  });
});

router.post('/checkouts', function (req, res) {
  var amount = req.body.amount; // In production you should not take amounts directly from clients
  var nonce = req.body.payment_method_nonce;

  gateway.transaction.sale({
    amount: amount,
    paymentMethodNonce: nonce
  }, function (err, result) {
    var transactionErrors;

    if (result.success) {
      res.redirect('checkouts/' + result.transaction.id);
    } else if (result.transaction) {
      req.flash('error', {msg: 'Transaction status - ' + result.transaction.status});
      res.redirect('checkouts/' + result.transaction.id);
    } else {
      transactionErrors = result.errors.deepErrors();
      req.flash('error', {msg: formatErrors(transactionErrors)});
      res.redirect('checkouts/new');
    }
  });
});

module.exports = router;
