import BigNumber from 'bignumber.js' // {{{1
import {
  Asset,
  Networks,
  TransactionBuilder,
  Operation,
} from 'stellar-sdk'
import { config } from './config.mjs'

const limit = config.ESCALATE_MAX // {{{1
const issuerPK = config.ISSUER
const SmartNFT = config.smartNFT
const server = config.server

export default async (body) => { // {{{1
  const { source: userPK } = body // {{{2

  const owners = await server // {{{2
    .trades()
    .forAssetPair(SmartNFT, Asset.native())
    .limit(limit)
    .order('desc')
    .call()
    .then(({ records }) => records.map(record => record.counter_account))
    .catch(() => [])
  /* See also:
   * - https://developers.stellar.org/api/resources/trades/list/
   */

  const interval = await server // {{{2
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
