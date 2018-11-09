// Internal use: this file is used for deployment purpose on FC environments
// eslint-disable-next-line import/no-dynamic-require
const config = require(process.env.name ? `./config-${process.env.name}.json` : './config.json');

export default config;
