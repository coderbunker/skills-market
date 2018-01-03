## Running the App

You must have [Node](https://nodejs.org/en/download/) and [Git](https://git-scm.com/downloads)
installed on your local machine or cloud instance.


To run the app, type the following command in your shell/command line:

```

> npm install

> npm run start

```

The webpack server is now running. Open up http://localhost:3000 in your browser, and you should be able to see the React app.

React pages, components, and routes can be found in the following directories:

```

src/components

src/pages

src/routes

```

To run an optimised build version of the app, run the following command:

```

> npm run build

```

## Integrating backend

Work has started on integrating the app with the 'utseus-api-master' at https://github.com/gelassen/skills-market.

Calls to the server are currently being made to http://localhost:7000.

You will need to change this to whichever port you run the backend on locally. (I had to enable CORS in the server to get this running locally on my machine.)

