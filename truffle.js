// Allows us to use ES6 in our migrations and tests.
require('babel-register')
require('babel-polyfill')

module.exports = {
  networks: {
    development: {
      host: "localhost", 
      port: 8545,
      network_id: "*",
      from: "0x7648f51a96fc1265c7fe5f3281c02ffb0dd693b9",
      gas: 4712388
    }
  }
}
