import crypto from 'crypto';
import querystring from 'querystring';
import config from '../config';
import { containsDataScopes, getPayloadOfIdToken } from '../helpers/utils';
import { requestDataInfo, requestUserInfo } from '../helpers/userInfoHelper';

/**
 * Format the url use in the redirection call
 * to the France Connect Authorization and logout API endpoint.
 * @see @link{ https://partenaires.franceconnect.gouv.fr/fcp/fournisseur-service# }
 */
export const oauthLoginAuthorize = (req, res) => {
  const { eidasLevel } = req.body;
  const scopes = Object.keys(req.body)
    .filter(key => key.startsWith('scope_'))
    .map(scope => scope.split('scope_').pop())
    .join(' ');

  const query = {
    scope: scopes,
    redirect_uri: `${config.FS_URL}${config.LOGIN_CALLBACK_FS_PATH}`,
    response_type: 'code',
    client_id: config.AUTHENTICATION_CLIENT_ID,
    state: crypto.randomBytes(32).toString('hex'),
    nonce: crypto.randomBytes(32).toString('hex'),
  };

  // Save requested scope in the session
  req.session.scope = query.scope;

  if (eidasLevel) {
    query.acr_values = eidasLevel;
  }

  const url = `${config.FC_URL}${config.AUTHORIZATION_FC_PATH}`;
  return res.redirect(`${url}?${querystring.stringify(query)}`);
};

export const oauthLoginCallback = async (req, res, next) => {
  try {
    const spConfig = {
      clientId: config.AUTHENTICATION_CLIENT_ID,
      clientSecret: config.AUTHENTICATION_CLIENT_SECRET,
      redirectUri: `${config.FS_URL}${config.LOGIN_CALLBACK_FS_PATH}`,
    };

    const { statusCode, user, idToken = null } = await requestUserInfo(req, spConfig);
    if (statusCode !== 200) {
      return res.sendStatus(statusCode);
    }

    // Fetch the data from FD only if data scope requested
    let data = null;
    const { scope } = req.session;
    if (containsDataScopes(scope)) {
      const { statusCode: dataStatusCode, data: dataInfo } = await requestDataInfo(req, spConfig);
      if (dataStatusCode !== 200) {
        return res.sendStatus(dataStatusCode);
      }
      data = dataInfo;
    }

    // Store the user and context in session so it is available for future requests
    // as the idToken for Logout
    req.session.user = user;
    req.session.data = data;
    req.session.idTokenPayload = getPayloadOfIdToken(idToken);
    req.session.idToken = idToken;

    return res.redirect('/data');
  } catch (error) {
    return next(error);
  }
};

/**
 * Format the url 's that is used in a redirect call to France Connect logout API endpoint
 * @returns {string}
 */
export const oauthLogoutAuthorize = (req, res) => {
  const { session: { idToken } } = req;
  const state = crypto.randomBytes(32).toString('hex');

  return res.redirect(
    `${config.FC_URL}${config.LOGOUT_FC_PATH}?id_token_hint=`
    + `${idToken}&state=${state}&post_logout_redirect_uri=${config.FS_URL}`
    + `${config.LOGOUT_CALLBACK_FS_PATH}`,
  );
};

export const oauthLogoutCallback = (req, res) => {
  // Empty session
  req.session.destroy();

  return res.redirect('/');
};
