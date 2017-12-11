// Allows us to use ES6 in our migrations and tests.
require('babel-register')
require('babel-polyfill')

module.exports = {
  networks: {
    development: {
      host: "localhost", 
      port: 8545,
      network_id: "*",
      from: "0x21517d80a32e189c5fdf88e9ddc21c24aa8d2641",
	  gas: 4712388
    }
  }
}
