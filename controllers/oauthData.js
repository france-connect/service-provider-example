import querystring from 'querystring';
import { httpClient } from '../helpers/httpClient';
import config from '../config';

/**
 * Format the url use in the redirection call
 * to the France Connect Authorization and logout API endpoint.
 * @see @link{ https://partenaires.franceconnect.gouv.fr/fcp/fournisseur-service# }
 */
export const oauthDataAuthorize = (req, res) => {
  const eidasQueryString = '&acr_values=eidas1';
  const scopes = encodeURIComponent(`${config.MANDATORY_SCOPES} ${config.DGFIP_SCOPES}`);

  return res.redirect(
    `${config.FC_URL}${config.AUTHORIZATION_FC_PATH}?`
      + `response_type=code&client_id=${config.DATA_CLIENT_ID}&redirect_uri=${config.FS_URL}`
      + `${config.DATA_CALLBACK_FS_PATH}&scope=${scopes}&state=home&nonce=customNonce11`
      + `${eidasQueryString}`,
  );
};

export const oauthDataCallback = async (req, res, next) => {
  try {
    // Set request params
    const body = {
      grant_type: 'authorization_code',
      redirect_uri: `${config.FS_URL}${config.DATA_CALLBACK_FS_PATH}`,
      client_id: config.DATA_CLIENT_ID,
      client_secret: config.DATA_CLIENT_SECRET,
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

    // Request data from data provider
    const { data } = await httpClient({
      method: 'GET',
      // Only valid if it's used with https://github.com/france-connect/data-provider-example/
      // If you want to use your own code change the url's value in the config/config.json file.
      url: `${config.FD_URL}${config.DGFIP_DATA_FD_PATH}`,
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // store data in session to be able to display them on data page
    req.session.data = data;

    return res.redirect('/data');
  } catch (error) {
    if (error.response && error.response.status === 404) {
      req.session.data = null;

      return res.redirect('/data');
    }

    return next(error);
  }
};

export const getData = (req, res) => res.render('pages/data', {
  data: req.session.data ? JSON.stringify(req.session.data, null, 2) : null,
  dataLink: 'https://github.com/france-connect/data-provider-example/blob/master/database.csv',
});
