'use strict';

var expect = require('chai').expect;
var supertest = require('supertest');
var superagent = require('superagent');
var agent = superagent.agent();

var api = supertest('http://localhost:3000');
var gateway = require('../lib/gateway');

describe('Checkout index page', function () {
  it('redirects to the checkouts new page', function (done) {
    api.get('/').expect(302, done);
  });

  it('responds with 200', function (done) {
    api.get('/checkouts/new').expect(200, done);
  });

  it('generates a client token', function (done) {
    api.get('/checkouts/new').end(function (err, res) {
      expect(res.text).to.match(/var token = \'[\w=]+\';/);
      done();
    });
  });

  it('includes the checkout form', function (done) {
    api.get('/checkouts/new').end(function (err, res) {
      expect(res.text).to.match(/<form id='checkout'/);
      done();
    });
  });

  it('includes the dropin payment-form div', function (done) {
    api.get('/checkouts/new').end(function (err, res) {
      expect(res.text).to.match(/<div id='payment-form'/);
      done();
    });
  });

  it('includes the amount field', function (done) {
    api.get('/checkouts/new').end(function (err, res) {
      expect(res.text).to.match(/<label for='amount/);
      expect(res.text).to.match(/<input type='text' name='amount' id='amount/);
      done();
    });
  });
});

describe('Checkouts show page', function () {
  it('respond with 200', function (done) {
    gateway.transaction.sale({
      amount: '10.00',
      paymentMethodNonce: 'fake-valid-nonce'
    }, function (err, result) {
      var transaction = result.transaction;

      api.get('/checkouts/' + transaction.id).expect(200, done);
    });
  });

  it("displays the transaction's fields", function (done) {
    gateway.transaction.sale({
      amount: '10.00',
      paymentMethodNonce: 'fake-valid-nonce'
    }, function (err, result) {
      var transaction = result.transaction;

      api.get('/checkouts/' + transaction.id).end(function (err, res) {
        expect(res.text).to.contain(transaction.id);
        expect(res.text).to.contain(transaction.type);
        expect(res.text).to.contain(transaction.amount);
        expect(res.text).to.contain(transaction.status);
        expect(res.text).to.contain(transaction.creditCard.bin);
        expect(res.text).to.contain(transaction.creditCard.last4);
        expect(res.text).to.contain(transaction.creditCard.cardType);
        expect(res.text).to.contain(transaction.creditCard.expirationDate);
        expect(res.text).to.contain(transaction.creditCard.customerLocation);
        done();
      });
    });
  });
});

describe('Checkouts create', function () {
  it('creates a transaction and redirects to checkout show', function (done) {
    api.post('/checkouts')
    .send({
      amount: '10.00',
      payment_method_nonce: 'fake-valid-nonce'
    })
    .expect(302, done);
  });

  context('when the transaction is not successful', function () {
    context('when braintree returns an error', function () {
      it('redirects to the new checkout page if transaction is not created', function (done) {
        api.post('/checkouts')
        .send({
          amount: 'not_a_valid_amount',
          payment_method_nonce: 'not_a_valid_nonce'
        })
        .expect(302)
        .expect('Location', 'checkouts/new')
        .end(done);
      });

      it('displays errors', function (done) {
        api.post('/checkouts')
          .send({amount: 'not_a_valid_amount', payment_method_nonce: 'not_a_valid_nonce'})
          .end(function (err, res) {
            var req;

            agent.saveCookies(res);
            req = api.get('/checkouts/new');

            agent.attachCookies(req);

            req.end(function (err, res) {
              expect(res.text).to.contain('Amount is an invalid format');
              done();
            });
          });
      });
    });

    context('when there are processor errors', function () {
      it('redirects to the checkouts show page', function (done) {
        api.post('/checkouts')
        .send({amount: '2000.00', payment_method_nonce: 'fake-valid-nonce'})
        .expect(302)
        .expect('Location', /checkouts\/[^new$][\w+]/)
        .end(done);
      });

      it('displays the transaction status', function (done) {
        api.post('/checkouts')
          .send({amount: '2000.00', payment_method_nonce: 'fake-valid-nonce'})
          .end(function (err, res) {
            var redirectUrl, req;

            agent.saveCookies(res);
            redirectUrl = '/' + res.headers.location;
            req = api.get(redirectUrl);
            agent.attachCookies(req);
            req.end(function (err, res) {
              expect(res.text).to.contain('Transaction status - processor_declined');
              done();
            });
          });
      });
    });
  });
});
