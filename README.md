# Braintree Express Example
An example Braintree integration for node in the Express framework.

## Setup Instructions

1. Install packages
  `npm install`

2. Add your Braintree API credentials to `.env`
  Credentials can be found by navigating to Account > My user > View API Keys in the Braintree control panel.

3. Start server
  `npm start`

## Running tests

All test are integration tests. Integration tests make api calls to Braintree and require that you set up your Braintree credentials. You can run this project's integration tests by adding your sandbox api credentials to `.env` and running `./node_modules/mocha/bin/mocha --timeout 2500` on the command line.
