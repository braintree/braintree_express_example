import { Router } from 'express';
import { Transaction } from 'braintree';
import { debug as logger } from 'debug';
import gateway from '../lib/gateway';

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

function createResultObject(transaction) {
  let result;
  const status = transaction.status;

  if (TRANSACTION_SUCCESS_STATUSES.indexOf(status) !== -1) {
    result = {
      header: 'Sweet Success!',
      icon: 'success',
      message: 'Your test transaction has been successfully processed. See the Braintree API response and try again.'
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
  gateway.clientToken.generate({}, (err, response) => {
    res.render('checkouts/new', {
      clientToken: response.clientToken,
      messages: req.flash('error')
    });
  });
});

router.get('/checkouts/:id', ({ params }, { render }) => {
  let result;
  const transactionId = params.id;

  gateway.transaction.find(transactionId, (err, transaction) => {
    result = createResultObject(transaction);
    render('checkouts/show', { transaction, result });
  });
});

router.post('/checkouts', (req, res) => {
  let transactionErrors;
  // In production you should not take amounts directly from clients
  const { amount, payment_method_nonce: paymentMethodNonce } = req.body;

  gateway.transaction.sale({
    amount,
    paymentMethodNonce,
    options: {
      submitForSettlement: true
    }
  }, (err, { errors, success, transaction }) => {
    if (success || transaction) {
      res.redirect(`checkouts/${transaction.id}`);
    } else {
      debug('err object from transaction.sale %O', err);
      transactionErrors = errors.deepErrors();
      req.flash('error', { msg: formatErrors(transactionErrors) });
      res.redirect('checkouts/new');
    }
  });
});

export default router;
