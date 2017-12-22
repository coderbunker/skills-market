This folders are part of my local dev environment inside truffle folder. 

A whole dev environement takes 80mb space and I hadn't found it reasonable to put it all into the repo.

Install environement

Install Truffle packages

`sudo npm install -g truffle`

Init Truffle project

`truffle init`

Install testrpc

`sudo npm install -g ethereumjs-testrpc`

Launch testrpc

`testrpc`

Testrpc will print out list of accounts. Modify truffle.js to add one of this accounts 

Go to app.js file, seek for profiles variable and update account list by what testrpc printout into console. 

source http://www.techtonet.com/how-to-install-and-execute-truffle-on-an-ubuntu-16-04/

Unpack and run server
Unzip server folder, go into and execute

`npm start`

API

curl GET http://localhost:3000/api/v1/users

{"users":[{"user":"lawlietyumiao"}]}

curl GET http://localhost:3000/api/v1/skills

[{"skill":"business model"},{"skill":"financial planning"}]

curl -x POST http://localhost:3000/api/v1/register/Ricky/React

user was successfully registered

curl -x POST http://localhost:3000/api/v1/help/Dmitry/React/10

{"success":true,"payload":"0xec5c84c3d854fcb74ac4182f740fa133a4a4815886dd4ce627c5348be325e91c"}

curl -x POST http://localhost:3000/api/v1/mentoring/Ricky/Dmitry/React/10

{"success":true,"payload":"{\"success\":true,\"payload\":\"0xcede8954fb10bce991edc367087881516ab343072308e5e9bc72aefdbdd0a992\"}"}

curl GET http://localhost:3000/api/v1/dashboard

curl -x POST http://localhost:3000/api/v1/validate/<:txhash>

{"success":true,"payload":"{\"transactionHash\":\"0xec5c84c3d854fcb74ac4182f740fa133a4a4815886dd4ce627c5348be325e91c\",\"transactionIndex\":0,\"blockHash\":\"0xc0b1831d872be58ffe7c97565f3cb424fca6508db979137ec9a2c76fbcf6aec5\",\"blockNumber\":2,\"gasUsed\":127814,\"cumulativeGasUsed\":127814,\"contractAddress\":null,\"logs\":[],\"status\":1}"}
