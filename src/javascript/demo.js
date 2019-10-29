import initDropin from './bt-dropin';

const container = document.getElementById('bt-dropin');
const paymentForm = document.getElementById('payment-form');
const amount = document.getElementById('amount');
const amountLabel = document.querySelector('label[for="amount"]');
const clientToken = document
  .getElementById('client-token')
  .getAttribute('value');

amount.addEventListener(
  'focus',
  () => {
    amountLabel.classList.add('has-focus');
  },
  false
);
amount.addEventListener(
  'blur',
  () => {
    amountLabel.classList.remove('has-focus');
  },
  false
);

initDropin({ clientToken, paymentForm, container });
