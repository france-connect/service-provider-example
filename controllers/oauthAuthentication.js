/**
 * Helper to get an access token from France Connect.
 * @see @link{ https://partenaires.franceconnect.gouv.fr/fcp/fournisseur-service# }
 */

import querystring from 'querystring';
import { httpClient } from '../helpers/httpClient';
import config from '../config';
import {
  getAcrFromIdToken,
} from '../helpers/utils';

/**
 * Format the url use in the redirection call
 * to the France Connect Authorization and logout API endpoint.
 * @see @link{ https://partenaires.franceconnect.gouv.fr/fcp/fournisseur-service# }
 */
export const oauthLoginAuthorize = (req, res) => {
  const eidasQueryString = req.body.eidasLevel ? `&acr_values=${req.body.eidasLevel}` : '';

  return res.redirect(
    `${config.FC_URL}${config.AUTHORIZATION_FC_PATH}?`
      + `response_type=code&client_id=${config.AUTHENTICATION_CLIENT_ID}&redirect_uri=${config.FS_URL}`
      + `${config.LOGIN_CALLBACK_FS_PATH}&scope=${config.MANDATORY_SCOPES} ${config.FC_SCOPES}&state=home&nonce=customNonce11`
      + `${eidasQueryString}`,
  );
};

/**
 * Init FranceConnect authentication login process.
 * Make every http call to the different API endpoints.
 */
export const oauthLoginCallback = async (req, res, next) => {
  try {
    // Set request params
    const bodyRequest = {
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
      data: querystring.stringify(bodyRequest),
      url: `${config.FC_URL}${config.TOKEN_FC_PATH}`,
    });

    if (!accessToken || !idToken) {
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
    req.session.user = user;
    req.session.context = { acr: getAcrFromIdToken(idToken) };
    req.session.idToken = idToken;

    return res.redirect('/user');
  } catch (tokenError) {
    return next(tokenError);
  }
};

export const getUser = (req, res) => res.render('pages/data', {
  user: req.session.user,
  data: JSON.stringify(req.session.user, null, 2),
  context: JSON.stringify(req.session.context, null, 2),
  dataLink: 'https://github.com/france-connect/identity-provider-example/blob/master/database.csv',
});

/**
 * Format the url 's that is used in a redirect call to France Connect logout API endpoint
 * @returns {string}
 */
export const oauthLogoutAuthorize = (req, res) => {
  const { session: { idToken } } = req;

  return res.redirect(
    `${config.FC_URL}${config.LOGOUT_FC_PATH}?id_token_hint=`
      + `${idToken}&state=customState11&post_logout_redirect_uri=${config.FS_URL}`
      + `${config.LOGOUT_CALLBACK_FS_PATH}`,
  );
};

export const oauthLogoutCallback = (req, res) => {
  // Empty session
  req.session.destroy();

  return res.redirect('/');
};
