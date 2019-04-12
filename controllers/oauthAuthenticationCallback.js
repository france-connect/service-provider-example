/**
 * Helper to get an access token from France Connect.
 * @see @link{ https://partenaires.franceconnect.gouv.fr/fcp/fournisseur-service# }
 */
import querystring from 'querystring';
import { httpClient } from '../helpers/httpClient';
import config from '../config';
import { getAcrFromIdToken } from '../helpers/utils';

/**
 * Init FranceConnect authentication login process.
 * Make every http call to the different API endpoints.
 */
export const oauthLoginCallback = async (req, res, next) => {
  // check if the mandatory Authorization code is there
  if (!req.query.code) {
    return res.sendStatus(400);
  }

  try {
    // Set request params
    const body = {
      grant_type: 'authorization_code',
      redirect_uri: `${config.FS_URL}${config.LOGIN_CALLBACK_FS_PATH}`,
      client_id: config.AUTHENTICATION_CLIENT_ID,
      client_secret: config.AUTHENTICATION_CLIENT_SECRET,
      code: req.query.code,
    };

    // Request access token.
    const { data: { access_token: accessToken, id_token: idToken } } = await httpClient({
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: querystring.stringify(body),
      url: `${config.FC_URL}${config.TOKEN_FC_PATH}`,
    });

    if (!accessToken) {
      return res.sendStatus(401);
    }

    // Request user data
    const { data: user } = await httpClient({
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
      url: `${config.FC_URL}${config.USERINFO_FC_PATH}`,
    });

    // Store the user in session so it is available for future requests
    // as the idToken for Logout, and the context
    req.session.idToken = idToken;
    req.session.user = user;
    req.session.context = { acr: getAcrFromIdToken(idToken) };
    req.session.debugRoute = 'https://github.com/france-connect/identity-provider-example/blob/master/database.csv';

    return res.redirect('/debugFC');
  } catch (error) {
    return next(error);
  }
};

export const debugDataFC = (req, res) => res.render('pages/data', {
  user: req.session.user,
  data: JSON.stringify(req.session.user, null, 2),
  context: JSON.stringify(req.session.context, null, 2),
  dataLink: req.session.debugRoute,
});


export const oauthLogoutCallback = (req, res) => {
  // Remove idToken, user, context and debug route from session
  req.session.idToken = null;
  req.session.user = null;
  req.session.context = null;
  req.session.debugRoute = null;

  return res.redirect('/');
};
