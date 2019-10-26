import initDropin from './bt-dropin';

const amount = document.getElementById('amount');
const amountLabel = document.querySelector('label[for="amount"]');

amount.addEventListener('focus', () => {
  amountLabel.className = 'has-focus';
}, false);
amount.addEventListener('blur', () => {
  amountLabel.className = '';
}, false);

initDropin();
