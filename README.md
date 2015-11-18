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

All test are integration tests. Integration tests make api calls to Braintree and require that you set up your Braintree credentials. You can run this project's integration tests by adding your sandbox api credentials to `.env` and running the following commands

```sh
# Start your node server
$ npm start

# Open another shell and run
$ ./node_modules/mocha/bin/mocha --timeout -2500
```

## Pro Tips

- If you encounter the error `TypeError: Cannot call method 'baseUrl' of undefined`, be sure that the environment set in your `.env` file is capitalized. For example, when using the sandbox environment it should be set to `Sandbox` and not `sandbox`.

## Disclaimer

This code is provided as is and is only intended to be used for illustration purposes. This code is not production-ready and is not meant to be used in a production environment. This repository is to be used as a tool to help merchants learn how to integrate with Braintree. Any use of this repository or any of its code in a production environment is highly discouraged.
