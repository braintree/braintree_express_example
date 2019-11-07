const { approved, declined } = require('../__fixtures__/gateway');

function find(transactionID) {
  switch (transactionID) {
    case '22222222':
      return Promise.resolve(declined);

    case '11111111':
    default:
      return Promise.resolve(approved);
  }
}

function sale({ amount }) {
  switch (amount) {
    case '10.00':
    case '10':
      return Promise.resolve({
        transaction: approved,
        success: true
      });
    case 'not_a_valid_amount':
      return Promise.reject({
        errors: {
          deepErrors() {
            return [
              {
                attribute: 'amount',
                code: '81503',
                message: 'Amount is an invalid format.'
              }
            ];
          },
          validationErrors: {},
          errorCollections: {
            transaction: {
              validationErrors: {
                amount: [
                  {
                    attribute: 'amount',
                    code: '81503',
                    message: 'Amount is an invalid format.'
                  }
                ]
              },
              errorCollections: {
                billing: { validationErrors: {}, errorCollections: {} },
                creditCard: {
                  validationErrors: {},
                  errorCollections: {
                    billingAddress: {
                      validationErrors: {},
                      errorCollections: {}
                    }
                  }
                }
              }
            }
          }
        },
        params: {
          transaction: {
            amount: 'not_valid',
            paymentMethodNonce: 'tokencc_bf_h3dsj2_wpfd9f_nchwt6_jthc2g_z85',
            options: { submitForSettlement: 'true' },
            type: 'sale'
          }
        },
        message: 'Amount is an invalid format.',
        success: false
      });
    case '2000':
    case '2000.00':
      return Promise.resolve({
        errors: { validationErrors: {}, errorCollections: {} },
        params: {
          transaction: {
            amount: '2000',
            paymentMethodNonce: 'tokencc_bf_6dsg8q_jpw7gn_yyff35_vvvt48_x5z',
            options: { submitForSettlement: 'true' },
            type: 'sale'
          }
        },
        message: 'Do Not Honor',
        transaction: declined,
        success: false
      });
    case '9999.99':
    default:
      return Promise.reject({
        errors: {
          deepErrors() {
            return [
              {
                attribute: 'payment_method_nonce',
                code: '91565',
                message: 'Unknown or expired payment_method_nonce.'
              }
            ];
          },
          validationErrors: {},
          errorCollections: {
            transaction: {
              validationErrors: {
                paymentMethodNonce: [
                  {
                    attribute: 'payment_method_nonce',
                    code: '91565',
                    message: 'Unknown or expired payment_method_nonce.'
                  }
                ]
              },
              errorCollections: {}
            }
          }
        },
        params: {
          transaction: {
            amount: '10',
            paymentMethodNonce: 'tokencc_bf_xxxxxx_mdwghc_mwkgsq_c4d3pr_rd3',
            options: { submitForSettlement: 'true' },
            type: 'sale'
          }
        },
        message: 'Unknown or expired payment_method_nonce.',
        success: false
      });
  }
}

function generate() {
  return Promise.resolve({ clientToken: 'bgclfngciljbnvgfujktjuhdb' });
}

module.exports = {
  transaction: {
    find,
    sale
  },
  clientToken: {
    generate
  }
};
