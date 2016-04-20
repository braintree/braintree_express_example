# Braintree Express Example
An example Braintree integration for Node in the Express framework.

## Setup Instructions

1. Install packages.

   ```sh
   npm install
   ```

2. Copy the `example.env` file to `.env` and fill in your Braintree API credentials. Credentials can be found by navigating to Account > My user > View API Keys in the Braintree control panel. Full instructions can be [found on our support site](https://articles.braintreepayments.com/control-panel/important-gateway-credentials#api-credentials).

3. Start the server.

   ```sh
   npm start
   ```

## Running tests

All tests are integration tests. Integration tests make API calls to Braintree and require that you set up your Braintree credentials. You can run this project's integration tests by adding your sandbox API credentials to `.env` and running the following commands:

```sh
# Start your node server
npm start

# Open another shell and run
npm test
```

## Help

 * Found a bug? Hava a suggestion for improvement? Want to tell us we're awesome? [Submit an issue](https://github.com/braintree/braintree_rails_example/issues)
 * Trouble with your integration? Contact [Braintree Support](https://support.braintreepayments.com/) / support@braintreepayments.com
 * Want to contribute? [Submit a pull request](https://help.github.com/articles/creating-a-pull-request)

## Disclaimer

This code is provided as is and is only intended to be used for illustration purposes. This code is not production-ready and is not meant to be used in a production environment. This repository is to be used as a tool to help merchants learn how to integrate with Braintree. Any use of this repository or any of its code in a production environment is highly discouraged.
