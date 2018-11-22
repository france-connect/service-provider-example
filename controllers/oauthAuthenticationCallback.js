/**
 * Helper to get an access token from France Connect.
 * @see @link{ https://partenaires.franceconnect.gouv.fr/fcp/fournisseur-service# }
 */
import axios from 'axios';
import querystring from 'querystring';
import config from '../config';

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
    const { data: { access_token: accessToken, id_token: idToken } } = await axios({
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: querystring.stringify(body),
      url: `${config.FC_URL}${config.TOKEN_FC_PATH}`,
    });

    if (!accessToken) {
      return res.sendStatus(401);
    }

    // Store the idToken in session so it is available for logout
    req.session.idToken = idToken;

    // Request user data
    const { data: user } = await axios({
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
      url: `${config.FC_URL}${config.USERINFO_FC_PATH}`,
    });

    // Store the user in session so it is available for future requests
    req.session.user = user;

    return res.redirect('/');
  } catch (error) {
    return next(error);
  }
};

export const oauthLogoutCallback = (req, res) => {
  // Remove idToken from session
  req.session.idToken = null;
  // Remove user from session
  req.session.user = null;

  return res.redirect('/');
};
