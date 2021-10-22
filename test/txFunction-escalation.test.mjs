import test from 'ava' // {{{1
import { Networks, TransactionBuilder, Utils } from 'stellar-sdk'
import { config } from '../config.mjs'
import signedFeeXDR from '../src/index.mjs'

test('TESTNET', t => { // {{{1
  t.is(
    config.HORIZON_URL, 
    'https://horizon-testnet.stellar.org'
  )
})

test('signedFeeXDR', async t => { // {{{1
  const fee = '1.9750000'
  const xdr = await signedFeeXDR(fee)
  const transaction = TransactionBuilder.fromXDR(
    xdr, Networks[config.STELLAR_NETWORK]
  )
  let result = Utils.verifyTxSignedBy(transaction, config.TXF_CREATOR) &&
    transaction.operations.length == 1

  const op = transaction.operations[0]
  result = op.asset.isNative() && op.type == 'payment' &&
    op.destination == config.TXF_AGENT && op.amount == fee

  console.log(typeof op.amount)

  t.true(result)
})

