// Allows us to use ES6 in our migrations and tests.
require('babel-register')
require('babel-polyfill')

module.exports = {
  networks: {
    development: {
      host: "localhost", 
      port: 8545,
      network_id: "*",
      from: "0x1d862db4b3381064fe5479cebd9a620cdd7dcff9",
	  gas: 4712388
    }
  }
}
