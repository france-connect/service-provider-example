/**
 * Format the url use in the redirection call
 * to the France Connect Authorization and logout API endpoint.
 * @see @link{ https://partenaires.franceconnect.gouv.fr/fcp/fournisseur-service# }
 */
import config from '../config';

export const getAuthorizationUrlForAuthentication = (eidasLevel, req) => {
  if (req.session.accessToken) { req.session.accessToken = null; }
  if (req.session.data) { req.session.data = null; }
  if (req.session.debugRoute) { req.session.debugRoute = null; }
  const eidasQueryString = eidasLevel ? `&acr_values=${eidasLevel}` : '';
  return `${config.FC_URL}${config.AUTHORIZATION_FC_PATH}?`
  + `response_type=code&client_id=${config.AUTHENTICATION_CLIENT_ID}&redirect_uri=${config.FS_URL}`
  + `${config.LOGIN_CALLBACK_FS_PATH}&scope=${config.MANDATORY_SCOPES} ${config.FC_SCOPES}&state=home&nonce=customNonce11`
  + `${eidasQueryString}`;
};

export const getAuthorizationUrlForData = (req) => {
  if (req.session.idToken) { req.session.idToken = null; }
  if (req.session.user) { req.session.user = null; }
  if (req.session.context) { req.session.context = null; }
  if (req.session.debugRoute) { req.session.debugRoute = null; }
  return `${config.FC_URL}${config.AUTHORIZATION_FC_PATH}?`
  + `response_type=code&client_id=${config.DATA_CLIENT_ID}&redirect_uri=${config.FS_URL}`
  + `${config.DATA_CALLBACK_FS_PATH}&scope=${config.MANDATORY_SCOPES} ${config.DGFIP_SCOPES}&state=home&nonce=customNonce11`;
};

/**
 * Format the url 's that is used in a redirect call to France Connect logout API endpoint
 * @returns {string}
 */
export const getLogoutUrl = idToken => `${config.FC_URL}${config.LOGOUT_FC_PATH}?id_token_hint=`
  + `${idToken}&state=customState11&post_logout_redirect_uri=${config.FS_URL}`
  + `${config.LOGOUT_CALLBACK_FS_PATH}`;

export const getAcrFromIdToken = idToken => JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString('utf8')).acr;
