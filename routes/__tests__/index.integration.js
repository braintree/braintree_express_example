const supertest = require('supertest');
const gateway = require('../../lib/gateway');

const PORT = process.env.PORT || 3000;
const { get, post } = supertest(`http://localhost:${PORT}`);

describe('Braintree demo routes integration', () => {
  describe('index page', () => {
    it('redirects to the checkouts new page', () =>
      get('/').then(({ header }) => {
        expect(header.location).toBe('/checkouts/new');
      }));
  });

  describe('Checkouts new page', () => {
    it('responds with 200', () =>
      get('/checkouts/new').then(({ status }) => {
        expect(status).toBe(200);
      }));
  });

  describe('Checkouts show page', () => {
    it('respond with 200', () =>
      gateway.transaction
        .sale({
          amount: '10.00',
          paymentMethodNonce: 'fake-valid-nonce',
          options: {
            submitForSettlement: true
          }
        })
        .then(({ transaction }) => {
          get(`/checkouts/${transaction.id}`).then(({ status }) => {
            expect(status).toBe(200);
          });
        }));

    it('displays the transaction fields', () =>
      gateway.transaction
        .sale({
          amount: '10.00',
          paymentMethodNonce: 'fake-valid-nonce',
          options: {
            submitForSettlement: true
          }
        })
        .then(({ transaction: { id, type, amount, status, creditCard } }) => {
          const {
            last4,
            bin,
            cardType,
            customerLocation,
            expirationDate
          } = creditCard;

          get(`/checkouts/${id}`).then(({ text }) => {
            expect(text).toMatch(type);
            expect(text).toMatch(amount);
            expect(text).toMatch(status);
            expect(text).toMatch(bin);
            expect(text).toMatch(last4);
            expect(text).toMatch(cardType);
            expect(text).toMatch(expirationDate);
            expect(text).toMatch(customerLocation);
          });
        }));

    it('displays a success page when transaction succeeded', () =>
      gateway.transaction
        .sale({
          amount: '11.00',
          paymentMethodNonce: 'fake-valid-nonce',
          options: {
            submitForSettlement: true
          }
        })
        .then(({ transaction }) =>
          get(`/checkouts/${transaction.id}`).then(({ text }) => {
            expect(text).toMatch('Sweet Success!');
          })
        ));

    it('displays a failure page when transaction failed', () =>
      gateway.transaction
        .sale({
          amount: '2000.00',
          paymentMethodNonce: 'fake-valid-nonce',
          options: {
            submitForSettlement: true
          }
        })
        .then(({ transaction }) =>
          get(`/checkouts/${transaction.id}`).then(({ text }) => {
            expect(text).toMatch('Transaction Failed');
            expect(text).toMatch(
              'Your test transaction has a status of processor_declined'
            );
          })
        ));
  });

  describe('Checkouts create', () => {
    it('creates a transaction and redirects to checkout show', () =>
      post('/checkouts')
        .send({
          amount: '10.00',
          // eslint-disable-next-line camelcase
          payment_method_nonce: 'fake-valid-nonce'
        })
        .then(({ status }) => {
          expect(status).toBe(302);
        }));

    describe('when the transaction is not successful', () => {
      describe('when braintree returns an error', () => {
        it('redirects to the new checkout page if transaction is not created', () =>
          post('/checkouts')
            .send({
              amount: 'not_a_valid_amount',
              // eslint-disable-next-line camelcase
              payment_method_nonce: 'not_a_valid_nonce'
            })
            .then(({ headers, status }) => {
              expect(status).toBe(302);
              expect(headers.location).toBe('checkouts/new');
            }));

        it('displays errors for invalid amount', () => {
          post('/checkouts')
            .send({
              amount: 'not_a_valid_amount',
              // eslint-disable-next-line camelcase
              payment_method_nonce: 'fake-valid-nonce'
            })
            .then(res => {
              const req = get('/checkouts/new');
              const cookie = res.headers['set-cookie'];

              req.set('Cookie', cookie);

              return req.then(({ text }) =>
                expect(text).toMatch(
                  'Error: 81503: Amount is an invalid format.'
                )
              );
            });
        });

        it('displays errors for invalid nonce', () =>
          post('/checkouts')
            .send({
              amount: 'not_a_valid_amount',
              // eslint-disable-next-line camelcase
              payment_method_nonce: 'not_a_valid_nonce'
            })
            .then(res => {
              const req = get('/checkouts/new');
              const cookie = res.headers['set-cookie'];

              req.set('Cookie', cookie);

              req.then(({ text }) =>
                expect(text).toMatch(
                  'Error: 91565: Unknown or expired payment_method_nonce.'
                )
              );
            }));
      });

      describe('when there are processor errors', () => {
        it('redirects to the checkouts show page', () =>
          post('/checkouts')
            .send({
              amount: '2000.00',
              // eslint-disable-next-line camelcase
              payment_method_nonce: 'fake-valid-nonce'
            })
            .then(response => {
              expect(response.status).toBe(302);
              expect(response.headers.location).toMatch(
                /checkouts\/[^new$][\w+]/
              );
            }));

        it('displays the transaction status', () => {
          post('/checkouts')
            .send({
              amount: '2000.00',
              // eslint-disable-next-line camelcase
              payment_method_nonce: 'fake-valid-nonce'
            })
            .then(({ headers }) => {
              const redirectUrl = `/${headers.location}`;
              const req = get(redirectUrl);
              const cookie = headers['set-cookie'];

              req.set('Cookie', cookie);

              return req.then(({ text }) =>
                expect(text).toMatch(
                  'Your test transaction has a status of processor_declined'
                )
              );
            });
        });
      });
    });
  });
});
