import test from 'ava' // {{{1
import { config } from '../config.mjs'

test('TESTNET', t => { // {{{1
  t.is(
    config.HORIZON_URL, 
    'https://horizon-testnet.stellar.org'
  )
})

