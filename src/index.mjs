import * as sscu from './stellar-smart-contract-utils.mjs' // {{{1

export default async function signedFeeXDR (fee) { // {{{1
  return await sscu.feeXDR(txF_CreatorAddress(), fee)
  .then(xdr => sscu.signXDR(xdr, txF_CreatorSecret()))
}

function txF_CreatorAddress () { // {{{1
  return process.env.TXF_CREATOR;
}

function txF_CreatorSecret () { // {{{1
  return process.env.TXF_CREATOR_SECRET;
}
// }}}1
