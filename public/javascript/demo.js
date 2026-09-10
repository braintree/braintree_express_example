'use strict';

(function () {
  var amount = document.querySelector('#amount');
  var amountLabel = document.querySelector('label[for="amount"]');
  var form = document.querySelector('#payment-form');
  var clientToken = document.getElementById('client-token').innerText;

  amount.addEventListener(
    'focus',
    function () {
      amountLabel.className = 'has-focus';
    },
    false
  );
  amount.addEventListener(
    'blur',
    function () {
      amountLabel.className = '';
    },
    false
  );

  window.braintree.client.create(
    {
      authorization: clientToken,
    },
    function (clientErr, clientInstance) {
      if (clientErr) {
        console.log('Error', clientErr);

        return;
      }

      window.braintree.hostedFields.create(
        {
          client: clientInstance,
          styles: {
            input: {
              'font-size': '16px',
              color: '#393536',
            },
          },
          fields: {
            number: {
              selector: '#card-number',
              placeholder: '4111 1111 1111 1111',
            },
            expirationDate: {
              selector: '#expiration-date',
              placeholder: 'MM/YY',
            },
            cvv: {
              selector: '#cvv',
              placeholder: '123',
            },
          },
        },
        function (hostedFieldsErr, hostedFieldsInstance) {
          if (hostedFieldsErr) {
            console.log('Error', hostedFieldsErr);

            return;
          }

          form.addEventListener('submit', function (event) {
            event.preventDefault();

            hostedFieldsInstance.tokenize(function (err, payload) {
              if (err) {
                console.log('Error', err);

                return;
              }

              // Add the nonce to the form and submit
              document.querySelector('#nonce').value = payload.nonce;
              form.submit();
            });
          });
        }
      );
    }
  );
})();
