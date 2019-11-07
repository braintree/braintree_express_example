const supertest = require('supertest');
const { approved } = require('../../lib/__fixtures__/gateway');
const app = require('../../app');

jest.mock('../../lib/gateway');

const { get, post } = supertest(app);

describe('Braintree demo routes', () => {
  describe('index', () => {
    it('redirects to the checkouts drop-in page', () =>
      get('/').then(({ header, statusCode }) => {
        expect(header.location).toBe('/checkouts/new');
        expect(statusCode).toBe(302);
      }));
  });

  describe('Checkouts new page', () => {
    it('responds with 200', () =>
      get('/checkouts/new').then(({ statusCode }) => {
        expect(statusCode).toBe(200);
      }));

    it('generates a client token', () =>
      get('/checkouts/new').then(({ text }) => {
        expect(text).toMatch('<span hidden id="client-token">');
      }));

    it('includes the checkout form', () =>
      get('/checkouts/new').then(({ text }) => {
        expect(text).toMatch(/<form id="payment-form"/);
      }));

    it('includes the dropin div', () =>
      get('/checkouts/new').then(({ text }) => {
        expect(text).toMatch(/<div id="bt-dropin"/);
      }));

    it('includes the amount field', () =>
      get('/checkouts/new').then(({ text }) => {
        expect(text).toMatch(/<label for="amount/);
        expect(text).toMatch(
          /<input id="amount" name="amount" type="tel" min="1" value="10">/
        );
      }));
  });

  describe('Checkouts show page', () => {
    it('respond with 200', () =>
      get('/checkouts/11111111').then(({ statusCode }) => {
        expect(statusCode).toBe(200);
      }));

    it("displays the transaction's fields", () =>
      get('/checkouts/11111111').then(({ text }) => {
        const { creditCard, amount, type, status } = approved;

        expect(text).toMatch('11111111');
        expect(text).toMatch(type);
        expect(text).toMatch(amount);
        expect(text).toMatch(status);
        expect(text).toMatch(creditCard.bin);
        expect(text).toMatch(creditCard.last4);
        expect(text).toMatch(creditCard.cardType);
        expect(text).toMatch(creditCard.expirationDate);
      }));

    it('displays a success page when transaction succeeded', () =>
      get('/checkouts/11111111').then(({ text }) => {
        expect(text).toMatch('Sweet Success!');
      }));

    it('displays a failure page when transaction failed', () =>
      get('/checkouts/22222222').then(({ text }) => {
        expect(text).toMatch('Transaction Failed');
        expect(text).toMatch(
          'Your test transaction has a status of processor_declined'
        );
      }));
  });

  describe('Checkouts create', () => {
    it('creates a transaction and redirects to checkout show', () =>
      post('/checkouts')
        .send({
          amount: '10.00',
          payment_method_nonce: 'fake-valid-nonce' // eslint-disable-line camelcase
        })
        .then(({ statusCode }) => {
          expect(statusCode).toBe(302);
        }));

    describe('when the transaction is not successful', () => {
      describe('when Braintree returns an error', () => {
        it('redirects to the drop-in checkout page if transaction is not created', () =>
          post('/checkouts')
            .send({
              amount: 'not_a_valid_amount',
              payment_method_nonce: 'not_a_valid_nonce' // eslint-disable-line camelcase
            })
            .then(({ headers, statusCode }) => {
              expect(statusCode).toBe(302);
              expect(headers.location).toBe('checkouts/new');
            }));

        it('displays errors for invalid amount', () =>
          post('/checkouts')
            .send({
              amount: 'not_a_valid_amount',
              payment_method_nonce: 'fake-valid-nonce' // eslint-disable-line camelcase
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
            }));

        it('displays errors for invalid nonce', () =>
          post('/checkouts')
            .send({
              amount: '9999.99',
              payment_method_nonce: 'not_a_valid_nonce' // eslint-disable-line camelcase
            })
            .then(res => {
              const req = get('/checkouts/new');
              const cookie = res.headers['set-cookie'];

              req.set('Cookie', cookie);

              return req.then(({ text }) =>
                expect(text).toMatch(
                  'Error: 91565: Unknown or expired payment_method_nonce.'
                )
              );
            }));
      });

      describe('when there are processor errors', () => {
        it('redirects to the new checkout page', () =>
          post('/checkouts')
            .send({
              amount: '2000.00',
              payment_method_nonce: 'fake-valid-nonce' // eslint-disable-line camelcase
            })
            .then(({ headers, statusCode }) => {
              expect(statusCode).toBe(302);
              expect(headers.location).toMatch(/checkouts\/\S{1,64}/);
            }));

        it('displays the transaction status', () =>
          post('/checkouts')
            .send({
              amount: '2000.00',
              payment_method_nonce: 'fake-valid-nonce' // eslint-disable-line camelcase
            })
            .then(res => {
              const redirectUrl = `/${res.req.res.headers.location}`;
              const req = get(redirectUrl);
              const cookie = res.headers['set-cookie'];

              req.set('Cookie', cookie);

              return req.then(({ text }) =>
                expect(text).toMatch(
                  'Your test transaction has a status of processor_declined'
                )
              );
            }));
      });
    });
  });
});
