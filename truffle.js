// Allows us to use ES6 in our migrations and tests.
require('babel-register')
require('babel-polyfill')

module.exports = {
  networks: {
    development: {
      host: "localhost", 
      port: 8545,
      network_id: "*",
      from: "0x0c2668d790e126c8aa722ee78b163c182f946cc4",
      gas: 4712388
    }
  }
}
