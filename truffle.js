// Allows us to use ES6 in our migrations and tests.
require('babel-register')
require('babel-polyfill')

module.exports = {
  networks: {
    development: {
      host: "localhost", 
      port: 8545,
      network_id: "*",
      from: "0x73bb2520a2c132de287dff9cb25c88cda33f603f",
	  gas: 4712388
    }
  }
}
