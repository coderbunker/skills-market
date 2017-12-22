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
