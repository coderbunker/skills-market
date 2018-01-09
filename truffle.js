// Allows us to use ES6 in our migrations and tests.
require('babel-register')
require('babel-polyfill')

module.exports = {
  networks: {
    development: {
      host: "localhost", 
      port: 8545,
      network_id: "*",
      from: "0x556d14d2fbd9fae3e5dd9c731161daf566cbed98",
      gas: 4712388
    }
  }
}
