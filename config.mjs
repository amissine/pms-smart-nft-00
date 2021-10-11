import { Asset, Server } from 'stellar-sdk' // {{{1

let config = { // {{{1
  ESCALATE_MAX: 95,
  HORIZON_URL: process.env.HORIZON_URL,
  ISSUER: process.env.ISSUER,
  STELLAR_NETWORK: process.env.STELLAR_NETWORK,
  server: new Server(process.env.HORIZON_URL),
  smartNFT: new Asset('SmartNFT00', process.env.ISSUER),
}

// }}}1
export { config }
