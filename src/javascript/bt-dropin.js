import { create } from 'braintree-web-drop-in';

const form = document.getElementById('payment-form');

function initDropin() {
  create({
    authorization: document.getElementById('client-token').getAttribute('value'),
    container: '#bt-dropin',
    paypal: {
      flow: 'vault'
    }
  }, (createErr, instance) => {
    form.addEventListener('submit', event => {
      event.preventDefault();

      instance.requestPaymentMethod((err, {nonce}) => {
        if (err) {
          console.error('Error', err);

          return;
        }

        // Add the nonce to the form and submit
        document.getElementById('nonce').setAttribute('value', nonce);
        form.submit();
      });
    });
  });
}

export default initDropin;
