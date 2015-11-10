var expect = require('chai').expect;
var supertest = require('supertest');
var api = supertest("http://localhost:3000");

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
});
