var expect = require('chai').expect;
var supertest = require('supertest');
var api = supertest("http://localhost:3000");
var gateway = require('../lib/gateway');

describe('Checkout index page', function(){
  it("responds with 200", function(done){
    api.get("/checkouts/new").expect(200, done);
  });

  it("generates a client token", function(done){
    api.get("/checkouts/new").end(function(err, res) {
      expect(res.text).to.match(/var token = \"[\w=]+\";/);
      done();
    });
  });

  it("includes the checkout form", function(done){
    api.get("/checkouts/new").end(function(err, res) {
      expect(res.text).to.match(/<form id="checkout"/);
      done();
    });
  });

  it("includes the dropin payment-form div", function(done){
    api.get("/checkouts/new").end(function(err, res) {
      expect(res.text).to.match(/<div id="payment-form"/);
      done();
    });
  });

  it("includes the amount field", function(done){
    api.get("/checkouts/new").end(function(err, res) {
      expect(res.text).to.match(/<label for="amount/);
      expect(res.text).to.match(/<input type="text" name="amount" id="amount/);
      done();
    });
  });
});

describe("Checkouts show page", function(){
  it("respond with 200", function(done){
    gateway.transaction.sale({
      amount: "10.00",
      payment_method_nonce: "fake-valid-nonce"
    }, function(err, result){
      transaction = result.transaction
      api.get("/checkouts/" + transaction.id).expect(200, done);
    });
  });

  it("displays the transaction's fields", function(done){
    gateway.transaction.sale({
      amount: "10.00",
      payment_method_nonce: "fake-valid-nonce"
    }, function(err, result){
      transaction = result.transaction
      api.get("/checkouts/" + transaction.id).end(function(err, res){
        expect(res.text).to.contain(transaction.id)
        expect(res.text).to.contain(transaction.type)
        expect(res.text).to.contain(transaction.amount)
        expect(res.text).to.contain(transaction.status)
        expect(res.text).to.contain(transaction.creditCard.bin)
        expect(res.text).to.contain(transaction.creditCard.last4)
        expect(res.text).to.contain(transaction.creditCard.cardType)
        expect(res.text).to.contain(transaction.creditCard.expirationDate)
        expect(res.text).to.contain(transaction.creditCard.customerLocation)
        done();
      });
    });

  });
});
