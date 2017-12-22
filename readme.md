This folders are part of my local dev environment inside truffle folder. 

A whole dev environement takes 80mb space and I hadn't found it reasonable to put it all into the repo.

Install environement

First, update and install packages

# sudo apt-get update && sudo apt-get -y upgrade
# sudo apt-get -y install curl git vim build-essential

Install NodeJs to execute the DAPP

# curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
# sudo apt-get install -y nodejs
# sudo npm install -g express

Install Truffle packages

# sudo npm install -g truffle

Install testrpc

# sudo npm install -g ethereumjs-testrpc

Launch testrpc

# testrpc

Init Truffle project

# mkdir myproject
# cd myprojet/
# truffle init
# truffle compile

testrpc should be launched
Deploy contracts on local chain

# truffle migrate

Create DAPP (not relevant to this project)

To build your frontend, run:

# truffle build

Launch server for DAPP testing

# truffle serve

Output should display

Serving app on port 8080...
Rebuilding...
Completed without errors

Optional: add -p option to change port

Go to http://localhost:8080 to see the Dapp
You can send Metacoin to an address (ex: 0x2742c08e81208d01ff48a8c0f7d7c738625f92f5 as see above from testrpc)
Each transactions are displayed on the testrpc process output

source http://www.techtonet.com/how-to-install-and-execute-truffle-on-an-ubuntu-16-04/

Unpack and run server
Unzip server folder, go into and execute

# npm start

(please note, testrpc should be run, one of accounts should be set into truffle.js)
