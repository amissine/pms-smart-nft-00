import { Asset, Server } from 'stellar-sdk' // {{{1

let config = { // {{{1
  ESCALATE_MAX: 95,
  HORIZON_URL: 'https://horizon-testnet.stellar.org',
  ISSUER: 'GBO5SAL2XT2RLTBM3FFFHPX43JQTXN7ETMFBBAPMUMOVGMQKDFWSIJ3Y',
  ISSUER_SECRET: 'SAW7ELX7HVP4PXOOIPSKK3OJHQ6TKVQK6JL4DJSJRZF2YB4GEE6TUL37',
  STELLAR_NETWORK: 'TESTNET',
  TXF_AGENT: 'GCCWIGGQY4XJKRPJUC6X7ITQMICNBIENUUTFZCYRU7BIRDKPHIGMJOL3',
  TXF_CREATOR: 'GA7TZL6MJIWRQO5EKOX4XSP4EEQN6BCOW6XHU4UCYHOA67PN3V5RMASS',
  TXF_CREATOR_SECRET: 'SB7KKMPNU6KTFOF73YJWKGAHG6BEPEGEAHPYFPRZHNKPKLDX7KG45NYJ',
  USER: 'GCVL2ZLW2FGVHZDV3EB5TFSXPGRWVVV5W3FB3JLLQTENAKBBFQDZJAHD',
  USER_SECRET: 'SBB4JSR6T77SF32EHPSK5QSEFWDHXBWAX5PS44F5UILLLWMZSFSZ2EPM',
  server: new Server('https://horizon-testnet.stellar.org'),
  smartNFT: new Asset('SmartNFT00', 'GBO5SAL2XT2RLTBM3FFFHPX43JQTXN7ETMFBBAPMUMOVGMQKDFWSIJ3Y'),
}

// }}}1
export { config }
