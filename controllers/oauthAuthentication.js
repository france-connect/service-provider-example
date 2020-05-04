import querystring from 'querystring';
import { httpClient } from '../helpers/httpClient';
import config from '../config';
import { getPayloadOfIdToken } from '../helpers/utils';

/**
 * Format the url use in the redirection call
 * to the France Connect Authorization and logout API endpoint.
 * @see @link{ https://partenaires.franceconnect.gouv.fr/fcp/fournisseur-service# }
 */
export const oauthLoginAuthorize = (req, res) => {
  const { eidasLevel } = req.body;

  const query = {
    scope: `${config.MANDATORY_SCOPES} ${config.FC_SCOPES}`,
    redirect_uri: `${config.FS_URL}${config.LOGIN_CALLBACK_FS_PATH}`,
    response_type: 'code',
    client_id: config.AUTHENTICATION_CLIENT_ID,
    state: 'home',
    nonce: 'customNonce11',
  };

  if (eidasLevel) {
    query.acr_values = eidasLevel;
  }

  const url = `${config.FC_URL}${config.AUTHORIZATION_FC_PATH}`;
  return res.redirect(`${url}?${querystring.stringify(query)}`);
};

export const oauthLoginCallback = async (req, res, next) => {
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

    if (!accessToken || !idToken) {
      return res.sendStatus(401);
    }

    // Request user data
    const { data: user } = await httpClient({
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
      url: `${config.FC_URL}${config.USERINFO_FC_PATH}`,
    });

    // Store the user and context in session so it is available for future requests
    // as the idToken for Logout
    req.session.user = user;
    req.session.idTokenPayload = getPayloadOfIdToken(idToken);
    req.session.idToken = idToken;

    return res.redirect('/user');
  } catch (error) {
    return next(error);
  }
};

export const getUser = (req, res) => res.render('pages/data', {
  user: req.session.user,
  data: JSON.stringify(req.session.user, null, 2),
  eIDASLevel: JSON.stringify(req.session.idTokenPayload.acr, null, 2),
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
