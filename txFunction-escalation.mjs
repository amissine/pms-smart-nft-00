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
const STELLAR_NETWORK = config.STELLAR_NETWORK

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
  /* See also:
   * - https://developers.stellar.org/api/resources/assets/list/
   * - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator
   * - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
   */

  return server.loadAccount(issuerPK).then((account) => { // {{{2
    let transaction = new TransactionBuilder(account, { // {{{3
      fee: '0',
      networkPassphrase: Networks[STELLAR_NETWORK]
    })
      .addOperation( // Operation.changeTrust {{{3
        Operation.changeTrust({
          asset: SmartNFT,
          limit: '1',
          source: userPK
        })
      )
      .addOperation( // Operation.setTrustLineFlags {{{3
        Operation.setTrustLineFlags({
          asset: SmartNFT,
          trustor: userPK,
          flags: {
            authorized: true,
          }
        })
      )
      .addOperation( // Operation.manageSellOffer {{{3
        Operation.manageSellOffer({
          selling: SmartNFT,
          buying: Asset.native(),
          amount: '1',
          price: '0.0000001'
        })
      )
      .addOperation( // Operation.manageBuyOffer {{{3
        Operation.manageBuyOffer({
          selling: Asset.native(),
          buying: SmartNFT,
          buyAmount: '1',
          price: '0.0000001',
          source: userPK
        })
      )
      .addOperation( // Operation.setTrustLineFlags {{{3
        Operation.setTrustLineFlags({
          asset: SmartNFT,
          trustor: userPK,
          flags: {
            authorized: false
          }
        })
      )

    owners.forEach((address) => { // {{{3
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

    // }}}3
    transaction = transaction.setTimeout(0).build()

    return transaction.toXDR()
  }) // }}}2
}
