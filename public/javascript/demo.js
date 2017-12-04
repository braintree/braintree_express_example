'use strict';

(function () {
  var amount = document.querySelector('#amount');
  var amountLabel = document.querySelector('label[for="amount"]');

  amount.addEventListener('focus', function () {
    amountLabel.className = 'has-focus';
  }, false);
  amount.addEventListener('blur', function () {
    amountLabel.className = '';
  }, false);
})();
