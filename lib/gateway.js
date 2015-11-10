var braintree = require('braintree');
require('dotenv').load();

var gateway = braintree.connect({
  environment: braintree.Environment[process.env.BT_ENVIRONMENT],
  merchantId: process.env.BT_MERCHANT_ID,
  publicKey: process.env.BT_PUBLIC_KEY,
  privateKey: process.env.BT_PRIVATE_KEY,
});

module.exports = gateway;
