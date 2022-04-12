import crypto from 'crypto';
import { URLSearchParams } from 'url';
import config from '../config';
import { getPayloadOfIdToken } from '../helpers/utils';
import { requestDataInfo, requestToken, requestUserInfo } from '../helpers/userInfoHelper';

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
    state: `state${crypto.randomBytes(32).toString('hex')}`,
    nonce: `nonce${crypto.randomBytes(32).toString('hex')}`,
    acr_values: 'eidas1',
  };

  const url = `${config.FC_URL}${config.AUTHORIZATION_FC_PATH}`;
  const params = new URLSearchParams(query).toString();
  return res.redirect(`${url}?${params}`);
};

export const oauthDataCallback = async (req, res, next) => {
  try {
    const spConfig = {
      clientId: config.DATA_CLIENT_ID,
      clientSecret: config.DATA_CLIENT_SECRET,
      code: req.query.code,
      redirectUri: `${config.FS_URL}${config.DATA_CALLBACK_FS_PATH}`,
    };

    const { accessToken, idToken } = await requestToken(spConfig);
    if (!accessToken || !idToken) {
      return res.sendStatus(401);
    }
    const user = await requestUserInfo(accessToken);
    const data = await requestDataInfo(accessToken);

    // Store the user and context in session so it is available for future requests
    // as the idToken for Logout
    req.session.user = user;
    req.session.data = data;
    req.session.idTokenPayload = getPayloadOfIdToken(idToken);
    req.session.idToken = idToken;

    return res.redirect('/user');
  } catch (error) {
    return next(error);
  }
};
