# Braintree Express Example

[![Build Status](https://travis-ci.org/braintree/braintree_express_example.svg?branch=master)](https://travis-ci.org/braintree/braintree_express_example)

An example Braintree integration for Node in the Express framework.

## Setup Instructions

1. Install packages:

   ```sh
   npm install
   ```

2. Copy the contents of `example.env` into a new file named `.env` and fill in your Braintree API credentials. Credentials can be found by navigating to Account > My User > View Authorizations in the Braintree Control Panel. Full instructions can be [found on our support site](https://articles.braintreepayments.com/control-panel/important-gateway-credentials#api-credentials).

3. Start the server:

   ```sh
   npm start
   ```
   
   By default, this runs the app on port `3000`. You can configure the port by setting the environmental variable `PORT`.

## Deploying to Heroku

You can deploy this app directly to Heroku to see the app live. Skip the setup instructions above and click the button below. This will walk you through getting this app up and running on Heroku in minutes.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/braintree/braintree_express_example&env[BT_ENVIRONMENT]=sandbox)

## Running tests

All tests are integration tests. Integration tests make API calls to Braintree and require that you set up your Braintree credentials. You can run this project's integration tests by adding your sandbox API credentials to `.env` and running the following commands:

```sh
# Start your node server
npm start

# Open another shell and run
npm test
```

## Testing Transactions

Sandbox transactions must be made with [sample credit card numbers](https://developers.braintreepayments.com/reference/general/testing/node#credit-card-numbers), and the response of a `Transaction.sale()` call is dependent on the [amount of the transaction](https://developers.braintreepayments.com/reference/general/testing/node#test-amounts).

## Help

 * Found a bug? Have a suggestion for improvement? Want to tell us we're awesome? [Submit an issue](https://github.com/braintree/braintree_express_example/issues)
 * Trouble with your integration? Contact [Braintree Support](https://support.braintreepayments.com/) / support@braintreepayments.com
 * Want to contribute? [Submit a pull request](https://help.github.com/articles/creating-a-pull-request)

## Disclaimer

This code is provided as is and is only intended to be used for illustration purposes. This code is not production-ready and is not meant to be used in a production environment. This repository is to be used as a tool to help merchants learn how to integrate with Braintree. Any use of this repository or any of its code in a production environment is highly discouraged.
