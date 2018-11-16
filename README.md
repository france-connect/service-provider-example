# Service-providers-example

An implementation example of the FranceConnect button on a service provider's website. There are two uses for the FranceConnect button in this example: 1) identify the user, 2) get their consent on personnal data exchange.

- [General documentation](https://partenaires.franceconnect.gouv.fr/fournisseur-service)
- the code on this repo is automatically deployed to our [demo Site](https://service-provider-example.herokuapp.com/)

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

More credentials are available [here](https://github.com/france-connect/identity-provider-example/blob/master/data/database.csv).

## Run the app with a local Data Provider (optional)

By default the app will interact with a Data Provider available online.

You can use a local instance of this Data Provider instead:

1. Install and run [this Data Provider](https://github.com/france-connect/data-provider-example) (go through the optional connected installation)
2. Restart this Service Provider with `FD_URL=http://localhost:4000 npm start`

##  Run the Tests

```bash
npm test
```
