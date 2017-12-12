// Allows us to use ES6 in our migrations and tests.
require('babel-register')
require('babel-polyfill')

module.exports = {
  networks: {
    development: {
      host: "localhost", 
      port: 8545,
      network_id: "*",
      from: "0x5bbfed83ac64980bbfb7be4927c65ac80d20d746",
	  gas: 4712388
    }
  }
}
