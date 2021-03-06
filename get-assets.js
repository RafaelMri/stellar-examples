const StellarSdk = require('stellar-sdk')
const loadAccount = require('./_load-account.js')

StellarSdk.Network.useTestNetwork()
StellarSdk.Config.setAllowHttp(true)

const HORIZON_SERVER = process.env.HORIZON_SERVER || 'https://horizon-testnet.stellar.org'
const server = new StellarSdk.Server(HORIZON_SERVER)

const issuer = loadAccount('./accounts/issuer.json')

// the JS SDK uses promises for most actions, such as retrieving an account
server.assets()
  .forCode('HHJ')
  .forIssuer(issuer.public)
  .call()
  .then(assets => {
    const asset = assets.records[0]
    console.log(asset)
    return server.transactions()
      .forAccount(issuer.public)
      .call()
  })
  .then(txs => {
    console.log('--- txs ----')
    console.log(txs)
    console.log('--- effects ----')
    return txs.records[1].operations()
      .then(e => console.log(e, e._embedded.records))
  })

