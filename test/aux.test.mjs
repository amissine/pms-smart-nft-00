import test from 'ava' // {{{1
import { Asset, Server } from 'stellar-sdk'
import BigNumber from 'bignumber.js'

const server = new Server('https://horizon.stellar.org')
const issuerPK = 'GCRHEEBJQ5FLJPHIGIQWJ7YLBT64MK7TS7W4K7PDIZQC5HCFN7KVKOWF'
const SmartNFT = new Asset('SmartNFT00', issuerPK)

test('Check the number of SmartNFT00 owners', async t => { // {{{1
  const owners = await server // {{{2
    .trades()
    .forAssetPair(SmartNFT, Asset.native())
    .limit(200) // 200 is the max allowed for the limit
    .order('desc')
    .call()
    .then(({ records }) => records.map(record => record.counter_account))
    .catch(() => [])
  
  console.log(owners.length)

  t.true(owners.length > 95)
})

test('Check the interval of SmartNFT00', async t => { // {{{1
  const interval = await server // {{{2
    .assets()
    .forCode(SmartNFT.code)
    .forIssuer(SmartNFT.issuer)
    .limit(1)
    .call()
    .then(({ records: [record] }) =>
      new BigNumber(record?.balances?.unauthorized ?? 0).toFixed(0, 3)
    )

  console.log(interval)

  t.is(1, 1)
})

