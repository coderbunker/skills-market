# Intro

This folders are part of my local dev environment inside truffle folder. 

A whole dev environement takes 80mb space and I hadn't found it reasonable to put it all into the repo.

## Install environment

A whole environment is described in scripts of package.json. Almost all what you need is run this scripts from the server folder. 

```
npm run install
npm run testrpc
npm run truffle
# run server API tests
npm run test-mocha
# run unit tests
npm run test-jest
```

## Configure truffle.js

Use one of accounts from output of testrpc to put into this truffle.js configuration 

```
require('babel-register')
require('babel-polyfill')

module.exports = {
  networks: {
    development: {
      host: "localhost", 
      port: 8545,
      network_id: "*",
      from: "0x041599451d9bac5bee252a5db569856085666f62",
      gas: 4712388
    }
  }
}
```

## Start the server
Move back to the server folder and execute this command

```
npm run start
```

## API

/users - to get list of users:
```
curl -X GET http://localhost:3000/api/v1/users

{"users":[{"user":"lawlietyumiao"}]}
```

/skills - to get list of skills:

```
curl -X GET http://localhost:3000/api/v1/skills

[{"skill":"business model"},{"skill":"financial planning"}]
```

/help/:mentee/:skill/:time - to register user with skill

```
curl -X POST http://localhost:3000/api/v1/register/Ricky/React

user was successfully registered
```

/help/:mentee/:skill/:time - To send request for help where last two parameters are skill and cost: 

```
curl -X  POST http://localhost:3000/api/v1/help/Dmitry/React/10

{"success":true,"payload":"0xec5c84c3d854fcb74ac4182f740fa133a4a4815886dd4ce627c5348be325e91c"}
```

/mentoring/:mentor/:mentee/:skill/:time - to provide help for user for specific skill 

```
curl -X POST http://localhost:3000/api/v1/mentoring/Ricky/Dmitry/React/10

{"success":true,"payload":"{\"success\":true,\"payload\":\"0xcede8954fb10bce991edc367087881516ab343072308e5e9bc72aefdbdd0a992\"}"}
```

/dashboard - get history of transactions 

```
curl -X GET http://localhost:3000/api/v1/dashboard
```

/validate/:txhash - check if this transaction has been mined

```
curl -X POST http://localhost:3000/api/v1/validate/<:txhash>

{"success":true,"payload":"{\"transactionHash\":\"0xec5c84c3d854fcb74ac4182f740fa133a4a4815886dd4ce627c5348be325e91c\",\"transactionIndex\":0,\"blockHash\":\"0xc0b1831d872be58ffe7c97565f3cb424fca6508db979137ec9a2c76fbcf6aec5\",\"blockNumber\":2,\"gasUsed\":127814,\"cumulativeGasUsed\":127814,\"contractAddress\":null,\"logs\":[],\"status\":1}"}
```
