import crypto from 'crypto';
import { URLSearchParams } from 'url';
import config from '../config';
import { containsDataScopes, containsTracksScopes, getPayloadOfIdToken } from '../helpers/utils';
import {
  requestDataInfo, requestToken, requestTracksDataInfo, requestUserInfo,
} from '../helpers/userInfoHelper';

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
    state: `state${crypto.randomBytes(32).toString('hex')}`,
    nonce: `nonce${crypto.randomBytes(32).toString('hex')}`,
  };

  // Save requested scopes in the session
  req.session.scopes = scopes;

  if (eidasLevel) {
    query.acr_values = eidasLevel;
  }

  const url = `${config.FC_URL}${config.AUTHORIZATION_FC_PATH}`;
  const params = new URLSearchParams(query).toString();
  return res.redirect(`${url}?${params}`);
};

export const oauthLoginCallback = async (req, res, next) => {
  try {
    const spConfig = {
      clientId: config.AUTHENTICATION_CLIENT_ID,
      clientSecret: config.AUTHENTICATION_CLIENT_SECRET,
      code: req.query.code,
      redirectUri: `${config.FS_URL}${config.LOGIN_CALLBACK_FS_PATH}`,
    };

    const { accessToken, idToken } = await requestToken(spConfig);
    if (!accessToken || !idToken) {
      return res.sendStatus(401);
    }
    const user = await requestUserInfo(accessToken);

    // Fetch the data from FD only if data scope requested
    let data = null;
    const { scopes } = req.session;
    if (containsDataScopes(scopes)) {
      data = await requestDataInfo(accessToken);
    }

    let tracks = null;
    if (containsTracksScopes(scopes)) {
      tracks = await requestTracksDataInfo(accessToken);
    }
    // Store the user and context in session so it is available for future requests
    // as the idToken for Logout
    req.session.user = user;
    req.session.data = data;
    req.session.tracks = tracks;
    req.session.idTokenPayload = getPayloadOfIdToken(idToken);
    req.session.idToken = idToken;

    return res.redirect('/user');
  } catch (error) {
    return next(error);
  }
};

export const getUser = (req, res) => {
  const {
    data, user, idTokenPayload = {}, tracks,
  } = req.session;
  return res.render('pages/data', {
    user,
    data,
    tracks,
    eIDASLevel: idTokenPayload.acr,
    userLink: 'https://github.com/france-connect/identity-provider-example/blob/master/database.csv',
    dataLink: 'https://github.com/france-connect/data-provider-example/blob/master/database.csv',
  });
};

/**
 * Format the url 's that is used in a redirect call to France Connect logout API endpoint
 * @returns {string}
 */
export const oauthLogoutAuthorize = (req, res) => {
  const { session: { idToken } } = req;
  const state = `state${crypto.randomBytes(32).toString('hex')}`;

  const paramsObj = {
    id_token_hint: idToken,
    state,
    post_logout_redirect_uri: `${config.FS_URL}${config.LOGOUT_CALLBACK_FS_PATH}`,
  };
  const params = new URLSearchParams(paramsObj).toString();
  return res.redirect(
    `${config.FC_URL}${config.LOGOUT_FC_PATH}?${params}`,
  );
};

export const oauthLogoutCallback = (req, res) => {
  // Empty session
  req.session.destroy();

  return res.redirect('/');
};
