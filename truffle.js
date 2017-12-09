// Allows us to use ES6 in our migrations and tests.
require('babel-register')
require('babel-polyfill')

module.exports = {
  networks: {
    development: {
      host: "localhost", 
      port: 8545,
      network_id: "*",
      from: "0x2e60e63d638874a5ca236ff400c69cb79f0c0ff6",
	  gas: 4712388
    }
  }
}
