import initDropin from './bt-dropin';

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

initDropin(clientToken);
