import crypto from 'crypto';
import querystring from 'querystring';
import config from '../config';
import { getPayloadOfIdToken } from '../helpers/utils';
import { requestDataInfo, requestUserInfo } from '../helpers/userInfoHelper';

/**
 * Format the url use in the redirection call
 * to the France Connect Authorization and logout API endpoint.
 * @see @link{ https://partenaires.franceconnect.gouv.fr/fcp/fournisseur-service# }
 */
export const oauthDataAuthorize = (req, res) => {
  const query = {
    scope: `${config.MANDATORY_SCOPES} ${config.DGFIP_SCOPES}`,
    redirect_uri: `${config.FS_URL}${config.DATA_CALLBACK_FS_PATH}`,
    response_type: 'code',
    client_id: config.DATA_CLIENT_ID,
    state: crypto.randomBytes(32).toString('hex'),
    nonce: crypto.randomBytes(32).toString('hex'),
    acr_values: 'eidas1',
  };

  const url = `${config.FC_URL}${config.AUTHORIZATION_FC_PATH}`;
  return res.redirect(`${url}?${querystring.stringify(query)}`);
};

export const oauthDataCallback = async (req, res, next) => {
  try {
    const spConfig = {
      clientId: config.DATA_CLIENT_ID,
      clientSecret: config.DATA_CLIENT_SECRET,
      redirectUri: `${config.FS_URL}${config.DATA_CALLBACK_FS_PATH}`,
    };

    const { statusCode, user, idToken = null } = await requestUserInfo(req, spConfig);
    if (statusCode !== 200) {
      return res.sendStatus(statusCode);
    }

    const { statusCode: dataStatusCode, data } = await requestDataInfo(req, spConfig);
    if (dataStatusCode !== 200) {
      return res.sendStatus(dataStatusCode);
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

export const getData = (req, res) => {
  const { data, user, idTokenPayload = {} } = req.session;
  return res.render('pages/data', {
    user,
    data,
    eIDASLevel: idTokenPayload.acr,
    userLink: 'https://github.com/france-connect/identity-provider-example/blob/master/database.csv',
    dataLink: 'https://github.com/france-connect/data-provider-example/blob/master/database.csv',
  });
};

