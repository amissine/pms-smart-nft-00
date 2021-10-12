import test from 'ava' // {{{1
import { Asset, Server } from 'stellar-sdk'

test('Check the number of SmartNFT00 owners', async t => { // {{{1
  const server = new Server('https://horizon.stellar.org')
  const issuerPK = 'GCRHEEBJQ5FLJPHIGIQWJ7YLBT64MK7TS7W4K7PDIZQC5HCFN7KVKOWF'
  const SmartNFT = new Asset('SmartNFT00', issuerPK)

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

