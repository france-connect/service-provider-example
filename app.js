/**
 * Entry point of the service provider(FS) demo app.
 * @see @link{ https://partenaires.franceconnect.gouv.fr/fcp/fournisseur-service# }
 */
import express from 'express';
import logger from 'morgan';
import session from 'express-session';
import sessionstore from 'sessionstore';
import bodyParser from 'body-parser';

import config from './config';
import {
  getAuthorizationUrlForAuthentication,
  getAuthorizationUrlForData,
  getLogoutUrl,
} from './helpers/utils';
import { oauthLoginCallback, oauthLogoutCallback, debugDataFC } from './controllers/oauthAuthenticationCallback';
import { oauthDataCallback, debugData } from './controllers/oauthDataCallback';

const app = express();

// Note this enable to store user session in memory
// As a consequence, restarting the node process will wipe all sessions data
app.use(session({
  store: sessionstore.createSessionStore(),
  secret: 'demo secret', // put your own secret
  cookie: {},
  saveUninitialized: true,
  resave: true,
}));

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.set('view engine', 'ejs');

// pass the user data from session to template global variables
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.accessToken = req.session.accessToken;
  res.locals.idToken = req.session.idToken;
  res.locals.debugRoute = req.session.debugRoute;
  next();
});

// define variable globally for the footer
app.locals.franceConnectKitUrl = `${config.FC_URL}${config.FRANCE_CONNECT_KIT_PATH}`;

app.get('/', (req, res) => res.render('pages/home'));

app.get('/login', (req, res) => res.render('pages/login'));

app.post('/login-with-france-connect', (req, res) => res.redirect(getAuthorizationUrlForAuthentication(req.body.eidasLevel, req)));

app.get('/login-callback', oauthLoginCallback);

app.get('/logout', (req, res) => res.redirect(getLogoutUrl(req.session.idToken)));

app.get('/logout-callback', oauthLogoutCallback);

app.get('/data', (req, res) => res.redirect(getAuthorizationUrlForData(req)));

app.get('/data-callback', oauthDataCallback);

app.get('/debugFC', debugDataFC);

app.get('/debug', debugData);

// Setting app port
const port = process.env.PORT || '3000';
// Starting server
const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`\x1b[32mServer listening on http://localhost:${port}\x1b[0m`);
});

export default server;
