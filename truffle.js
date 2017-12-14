// Allows us to use ES6 in our migrations and tests.
require('babel-register')
require('babel-polyfill')

module.exports = {
  networks: {
    development: {
      host: "localhost", 
      port: 8545,
      network_id: "*",
      from: "0xe15de584776c1e573d71883a2153cd5bb67fd0a8",
	    gas: 4712388
    }
  }
}
