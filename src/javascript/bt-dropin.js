import { create } from 'braintree-web-drop-in';

function initDropin({ clientToken, paymentForm, container }) {
  create({
    authorization: clientToken,
    container,
    paypal: {
      flow: 'vault'
    }
  }).then(
    instance => {
      paymentForm.addEventListener('submit', event => {
        event.preventDefault();

        instance
          .requestPaymentMethod()
          .then(({ nonce }) => {
            // Add the nonce to the form and submit
            document.getElementById('nonce').setAttribute('value', nonce);
            paymentForm.submit();
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
