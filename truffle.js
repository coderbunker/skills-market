// Allows us to use ES6 in our migrations and tests.
require('babel-register')
require('babel-polyfill')

module.exports = {
  networks: {
    development: {
      host: "localhost", 
      port: 8545,
      network_id: "*",
      from: "0xd2f035de5bd5c9e8697a5fb8c3e214f752cf3712",
	  gas: 4712388
    }
  }
}
