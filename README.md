# service-provider-example

An implementation example of the FranceConnect button on a service provider's website. There are two uses for the FranceConnect button in this example: 1) identify the user, 2) get their consent on personnal data exchange.

- [General documentation](https://partenaires.franceconnect.gouv.fr/fournisseur-service)
- the code on this repo is automatically deployed to our [demo site](http://fournisseur-de-service.dev-franceconnect.fr/)

## Prerequisites

This server use [nodejs version 8.12](https://nodejs.org/en/download/).

## Install

```bash
git clone git@github.com:france-connect/service-provider-example.git
cd service-provider-example
npm install
```

##  Run the app

```bash
npm start
```

## Use the app 

When you start the app, the demo is available at : http://localhost:3000.

To start the France Connect authentication process, click on the France Connect button.

You will be prompted to choose an identity provider. Choose 'identity-provider-example'.

You can use the following test credentials : 3_melaine | 123

More credentials are available [here](https://github.com/france-connect/identity-provider-example/blob/master/database.csv).

## Run the app with a local Data Provider (optional)

By default the app will interact with a Data Provider available online.

You can use a local instance of this Data Provider instead:

1. Install and run [this Data Provider](https://github.com/france-connect/data-provider-example) (go through the optional connected installation)
2. Restart this Service Provider with `FD_URL=http://localhost:4000 npm start`

##  Run the tests

```bash
npm test
```

## Run the linter

Run the linter with:
```bash
npm run lint
```

## Public key for Franceconnect integration environment

This repository is shipped with public integration keys.
It allow you to discover the application and start your tests without waiting for the validation of
your request on https://signup.api.gouv.fr/franceconnect.

This key is for limited use and has no support from our team:

- CLIENT_ID: '211286433e39cce01db448d80181bdfd005554b19cd51b3fe7943f6b3b86ab6e'
- CLIENT_SECRET: '2791a731e6a59f56b6b4dd0d08c9b1f593b5f3658b9fd731cb24248e2669af4b'

The allowed callback URL with this key are listed bellow :

- http://localhost:4242/callback
- http://localhost:8080/callback
- http://localhost:1337/callback
- http://localhost:3000/callback
- http://localhost:4242/callback.php
- http://localhost:8080/callback.php
- http://localhost:1337/callback.php
- http://localhost:3000/callback.php
- http://localhost:1337/login-callback
- http://localhost:4242/login-callback
- http://localhost:8080/login-callback
- http://localhost:3000/login-callback
- http://localhost:1337/data-callback
- http://localhost:4242/data-callback
- http://localhost:8080/data-callback
- http://localhost:3000/data-callback
- http://localhost:4242/logout
- http://localhost:8080/logout
- http://localhost:1337/logout
- http://localhost:3000/logout
- http://localhost:4242/logout-callback
- http://localhost:8080/logout-callback
- http://localhost:1337/logout-callback
- http://localhost:3000/logout-callback
