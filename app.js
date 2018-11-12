/**
 * Entry point of the service provider(FS) demo app.
 * @see @link{ https://partenaires.franceconnect.gouv.fr/fcp/fournisseur-service# }
 */
import express from 'express';
import logger from 'morgan';
import session from 'express-session';
import sessionstore from 'sessionstore';
import config from './config';
import { getAuthorizationUrl, getLogoutUrl } from './helpers/utils';
import oauthCallback from './controllers/oauthCallback';
import getDgfipData from './controllers/getDgfipData';

const app = express();

/**
 * Session config
 * About the warning on connect.session()
 * @see {@link https://github.com/expressjs/session/issues/556}
 * @see {@link https://github.com/expressjs/session/blob/master/README.md#compatible-session-stores}
 */
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

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Routes (@see @link{ see https://expressjs.com/en/guide/routing.html }
app.get('/', (req, res) => {
  res.render('pages/index', {
    isUserAuthenticated: false,
    franceConnectKitUrl: `${config.FC_URL}${config.FRANCE_CONNECT_KIT_PATH}`,
  });
});

app.get('/login', (req, res) => {
  res.redirect(getAuthorizationUrl());
});

app.get('/callback', oauthCallback);

app.get('/profile', (req, res) => {
  if (!req.session.accessToken) {
    return res.sendStatus(401);
  }

  return res.render('pages/profile', {
    // get user info from session
    user: req.session.userInfo,
    isUserAuthenticated: true,
    franceConnectKitUrl: `${config.FC_URL}${config.FRANCE_CONNECT_KIT_PATH}`,
  });
});

app.get('/callFd', getDgfipData);

app.get('/logout', (req, res) => {
  res.redirect(getLogoutUrl(req));
});

app.get('/logged-out', (req, res) => {
  // Resetting the id token hint.
  req.session.idToken = null;
  // Resetting the userInfo.
  req.session.userInfo = null;
  res.render('pages/logged-out', {
    isUserAuthenticated: false,
    franceConnectKitUrl: `${config.FC_URL}${config.FRANCE_CONNECT_KIT_PATH}`,
  });
});

// Setting app port
const port = process.env.PORT || '3000';
// Starting server
const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`\x1b[32mServer listening on http://localhost:${port}\x1b[0m`);
});

export default server;
