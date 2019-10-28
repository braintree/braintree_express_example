import { create } from 'braintree-web-drop-in';

const form = document.getElementById('payment-form');

function initDropin(clientToken) {
  create({
    authorization: clientToken,
    container: '#bt-dropin',
    paypal: {
      flow: 'vault'
    }
  }).then(
    instance => {
      form.addEventListener('submit', event => {
        event.preventDefault();

        instance
          .requestPaymentMethod()
          .then(({ nonce }) => {
            // Add the nonce to the form and submit
            document.getElementById('nonce').setAttribute('value', nonce);
            form.submit();
          })
          .catch(err => {
            console.error('Error', err);
          });
      });
    },
    createError => {
      console.error('Error creating dropin', createError);
    }
  );
}

export default initDropin;
