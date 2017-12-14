// Allows us to use ES6 in our migrations and tests.
require('babel-register')
require('babel-polyfill')

module.exports = {
  networks: {
    development: {
      host: "localhost", 
      port: 8545,
      network_id: "*",
      from: "0xa475dbd06aef482ab49349c54fccfd34b9a4bfd8",
	  gas: 4712388
    }
  }
}
