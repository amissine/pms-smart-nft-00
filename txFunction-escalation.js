const BigNumber = require('bignumber.js')
const { map } = require('lodash')
const {
  Server,
  Networks,
  TransactionBuilder,
  Operation,
  Asset
} = require('stellar-sdk')

const limit = 95
const issuerPK = 'GCRHEEBJQ5FLJPHIGIQWJ7YLBT64MK7TS7W4K7PDIZQC5HCFN7KVKOWF'
const SmartNFT = new Asset('SmartNFT00', issuerPK)
const server = new Server(HORIZON_URL)

module.exports = async (body) => {
  const { source: userPK } = body

  const owners = await server
    .trades()
    .forAssetPair(SmartNFT, Asset.native())
    .limit(limit)
    .order('desc')
    .call()
    .then(({ records }) => map(records, 'counter_account'))
    .catch(() => [])

  const interval = await server
    .assets()
    .forCode(SmartNFT.code)
    .forIssuer(SmartNFT.issuer)
    .limit(1)
    .call()
    .then(({ records: [record] }) =>
      new BigNumber(record?.balances?.unauthorized ?? 0).toFixed(0, 3)
    )

  return server.loadAccount(issuerPK).then((account) => {
    let transaction = new TransactionBuilder(account, {
      fee: '0',
      networkPassphrase: Networks[STELLAR_NETWORK]
    })
      .addOperation(
        Operation.changeTrust({
          asset: SmartNFT,
          limit: '1',
          source: userPK
        })
      )
      .addOperation(
        Operation.setTrustLineFlags({
          asset: SmartNFT,
          trustor: userPK,
          flags: {
            authorized: true,
          }
        })
      )
      .addOperation(
        Operation.manageSellOffer({
          selling: SmartNFT,
          buying: Asset.native(),
          amount: '1',
          price: '0.0000001'
        })
      )
      .addOperation(
        Operation.manageBuyOffer({
          selling: Asset.native(),
          buying: SmartNFT,
          buyAmount: '1',
          price: '0.0000001',
          source: userPK
        })
      )
      .addOperation(
        Operation.setTrustLineFlags({
          asset: SmartNFT,
          trustor: userPK,
          flags: {
            authorized: false
          }
        })
      )

    owners.forEach((address) => {
      const amount = new BigNumber(interval).div(limit).pow(2).toFixed(0, 2)

      transaction.addOperation(
        Operation.payment({
          destination: address,
          asset: Asset.native(),
          amount,
          source: userPK
        })
      )
    })

    transaction = transaction.setTimeout(0).build()

    return transaction.toXDR()
  })
}