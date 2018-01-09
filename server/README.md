# utseus-api
Node express API for utseus

# Starting
1. Make sure node is installed.
2. Run `npm install`
3. Configure the port in ./config.js if necessary, default is 3000
4. Run `npm start` to start the API

# Quick rundown
NPM handles the dependencies, linting and starting of the application

the endpoints are defined in the app.js

logging is done using the 'debug' logger. all namespaces are being logged except everything starting with 'express'


./http.js file are just some HTTP status code constants

./mock.js is a temporary file to provide mock data

./config.js is the configuration file, for now only contains the port

./controllers/ dir contains the implementations of the endpoints
