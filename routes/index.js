const { Router } = require('express');
const { Transaction } = require('braintree');
const logger = require('debug');
const gateway = require('../lib/gateway');

const router = Router(); // eslint-disable-line new-cap
const debug = logger('braintree_example:router');
const TRANSACTION_SUCCESS_STATUSES = [
  Transaction.Status.Authorizing,
  Transaction.Status.Authorized,
  Transaction.Status.Settled,
  Transaction.Status.Settling,
  Transaction.Status.SettlementConfirmed,
  Transaction.Status.SettlementPending,
  Transaction.Status.SubmittedForSettlement
];

function formatErrors(errors) {
  let formattedErrors = '';

  for (let [, { code, message }] of Object.entries(errors)) {
    formattedErrors += `Error: ${code}: ${message}
`;
  }

  return formattedErrors;
}

function createResultObject({ status }) {
  let result;

  if (TRANSACTION_SUCCESS_STATUSES.indexOf(status) !== -1) {
    result = {
      header: 'Sweet Success!',
      icon: 'success',
      message:
        'Your test transaction has been successfully processed. See the Braintree API response and try again.'
    };
  } else {
    result = {
      header: 'Transaction Failed',
      icon: 'fail',
      message: `Your test transaction has a status of ${status}. See the Braintree API response and try again.`
    };
  }

  return result;
}

router.get('/', (req, res) => {
  res.redirect('/checkouts/new');
});

router.get('/checkouts/new', (req, res) => {
  gateway.clientToken.generate({}).then(({ clientToken }) => {
    res.render('checkouts/new', {
      clientToken,
      messages: req.flash('error')
    });
  });
});

router.get('/checkouts/:id', (req, res) => {
  let result;
  const transactionId = req.params.id;

  gateway.transaction.find(transactionId).then(transaction => {
    result = createResultObject(transaction);
    res.render('checkouts/show', { transaction, result });
  });
});

router.post('/checkouts', (req, res) => {
  // In production you should not take amounts directly from clients
  const { amount, payment_method_nonce: paymentMethodNonce } = req.body;

  gateway.transaction
    .sale({
      amount,
      paymentMethodNonce,
      options: { submitForSettlement: true }
    })
    .then(result => {
      const { success, transaction } = result;

      return new Promise((resolve, reject) => {
        if (success || transaction) {
          res.redirect(`checkouts/${transaction.id}`);

          resolve();
        }

        reject(result);
      });
    })
    .catch(({ errors }) => {
      const deepErrors = errors.deepErrors();

      debug('errors from transaction.sale %O', deepErrors);

      req.flash('error', { msg: formatErrors(deepErrors) });
      res.redirect('checkouts/new');
    });
});

module.exports = router;
