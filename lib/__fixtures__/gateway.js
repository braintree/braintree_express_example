const approved = {
  id: '11111111',
  status: 'submitted_for_settlement',
  type: 'sale',
  currencyIsoCode: 'USD',
  amount: '10.00',
  billing: {
    postalCode: '10001'
  },
  avsPostalCodeResponseCode: 'M',
  avsStreetAddressResponseCode: 'I',
  cvvResponseCode: 'M',
  processorAuthorizationCode: 'JLY1TS',
  processorResponseCode: '1000',
  processorResponseText: 'Approved',
  taxExempt: false,
  creditCard: {
    token: null,
    bin: '411111',
    last4: '1111',
    cardType: 'Visa',
    expirationMonth: '11',
    expirationYear: '2020',
    customerLocation: 'US',
    cardholderName: null,
    imageUrl:
      'https://assets.braintreegateway.com/payment_method_logo/visa.png?environment=sandbox',
    prepaid: 'Unknown',
    healthcare: 'Unknown',
    debit: 'Unknown',
    durbinRegulated: 'Unknown',
    commercial: 'Unknown',
    payroll: 'Unknown',
    issuingBank: 'Unknown',
    countryOfIssuance: 'Unknown',
    productId: 'Unknown',
    venmoSdk: false,
    maskedNumber: '411111******1111',
    expirationDate: '11/2020'
  },
  statusHistory: [
    {
      timestamp: '2019-10-28T22:01:20Z',
      status: 'authorized',
      amount: '10.00',
      transactionSource: 'api'
    },
    {
      timestamp: '2019-10-28T22:01:20Z',
      status: 'submitted_for_settlement',
      amount: '10.00',
      transactionSource: 'api'
    }
  ],
  paymentInstrumentType: 'credit_card',
  processorSettlementResponseCode: '',
  processorSettlementResponseText: '',
  networkResponseCode: 'XX',
  networkResponseText: 'sample network response text',
  riskData: {
    id: '73K00PKK3P6C',
    decision: 'Approve',
    fraudServiceProvider: 'kount',
    deviceDataCaptured: false
  },
  threeDSecureInfo: null,
  networkTransactionId: '020191028100120',
  processorResponseType: 'approved',
  authorizationExpiresAt: '2019-11-04T22:01:20Z',
  globalId: 'dHJhbnNhY3Rpb25fMHg5ZTZ0cWo'
};
const declined = {
  id: '22222222',
  status: 'processor_declined',
  type: 'sale',
  currencyIsoCode: 'USD',
  amount: '2000.00',
  createdAt: '2019-10-28T22:12:49Z',
  updatedAt: '2019-10-28T22:12:50Z',
  billing: {
    postalCode: '10001'
  },
  avsPostalCodeResponseCode: 'M',
  avsStreetAddressResponseCode: 'I',
  cvvResponseCode: 'M',
  processorResponseCode: '2000',
  processorResponseText: 'Do Not Honor',
  additionalProcessorResponse: '2000 : Do Not Honor',
  creditCard: {
    token: null,
    bin: '411111',
    last4: '1111',
    cardType: 'Visa',
    expirationMonth: '11',
    expirationYear: '2020',
    customerLocation: 'US',
    cardholderName: null,
    imageUrl:
      'https://assets.braintreegateway.com/payment_method_logo/visa.png?environment=sandbox',
    prepaid: 'Unknown',
    healthcare: 'Unknown',
    debit: 'Unknown',
    durbinRegulated: 'Unknown',
    commercial: 'Unknown',
    payroll: 'Unknown',
    issuingBank: 'Unknown',
    countryOfIssuance: 'Unknown',
    productId: 'Unknown',
    venmoSdk: false,
    maskedNumber: '411111******1111',
    expirationDate: '11/2020'
  },
  statusHistory: [
    {
      timestamp: '2019-10-28T22:12:50Z',
      status: 'processor_declined',
      amount: '2000.00',
      transactionSource: 'api'
    }
  ],
  recurring: false,
  paymentInstrumentType: 'credit_card',
  networkResponseCode: 'XX',
  networkResponseText: 'sample network response text',
  riskData: {
    id: '73K00MS5DSMQ',
    decision: 'Decline',
    fraudServiceProvider: 'kount',
    deviceDataCaptured: false
  },
  networkTransactionId: '020191028101250',
  processorResponseType: 'soft_declined',
  globalId: 'dHJhbnNhY3Rpb25fMXIyMjl5bTY'
};

module.exports = {
  approved,
  declined
};
