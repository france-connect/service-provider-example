# Service-providers-example

An example of Service Provider for FranceConnect.

[`Documentation`](https://partenaires.franceconnect.gouv.fr/fournisseur-service)

## Prerequisites

This server use [nodejs version 8.12](https://nodejs.org/en/download/).

## Install

```bash
git clone git@github.com:france-connect/service-providers-examples.git
cd service-providers-examples/NodeJSES6/
npm install
```

##  Run the app

```bash
npm start
```

## Use the app 

When you start the app, the demo is available at : http://localhost:3000.

To start the France Connect authentication process, click on the France Connect button.

You will be prompted to choose an identity provider. Choose impots.gouv.fr.

You can use the following test credentials : 3_melaine | 123

More credentials are available [here](https://github.com/france-connect/identity-providers-examples/blob/master/NodeJSES6/data/database.csv).

## Run the app with a local Data Provider (optional)

By default the app will interact with a Data Provider available online.

You can use a local instance of this Data Provider instead:

1. Install and run [this Data Provider](https://github.com/france-connect/data-providers-examples/tree/master/nodejs_ES6) (go through the optional connected installation)
2. In `service-providers-examples/NodeJSES6/config/config.json` set `"FD_URL": "http://localhost:4000",`
3. Restart this Service Provider

##  Run the Tests

```bash
npm test
```
