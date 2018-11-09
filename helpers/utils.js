/**
 * Format the url use in the redirection call
 * to the France Connect Authorization and logout API endpoint.
 * @see @link{ https://partenaires.franceconnect.gouv.fr/fcp/fournisseur-service# }
 */
import config from '../config/configManager';
// TODO hard code state et nonce because they normally generate from every request
export const getAuthorizationUrl = () => `${config.FC_URL}${config.AUTHORIZATION_FC_PATH}?`
  + `response_type=code&client_id=${config.CLIENT_ID}&redirect_uri=${config.FS_URL}`
  + `${config.CALLBACK_FS_PATH}&scope=${config.SCOPES}&state=customState11&nonce=customNonce11`;


/**
 * Format the url 's that is used in a redirect call to France Connect logout API endpoint
 * @returns {string}
 */
export const getLogoutUrl = req => `${config.FC_URL}${config.LOGOUT_FC_PATH}?id_token_hint=`
  + `${req.session.idToken}&state=customState11&post_logout_redirect_uri=${config.FS_URL}`
  + `${config.LOGOUT_FS_PATH}`;
