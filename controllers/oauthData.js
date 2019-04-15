import querystring from 'querystring';
import { httpClient } from '../helpers/httpClient';
import config from '../config';

/**
 * Use to send the access token to an data provider.
 * @return Response with the queried data from the provider.
 * @see @link{ https://partenaires.franceconnect.gouv.fr/fcp/fournisseur-donnees }
 * @see @link{ https://github.com/france-connect/data-providers-examples }
 */
export const oauthDataCallback = async (req, res, next) => {
  // check if the mandatory Authorization code is there
  if (!req.query.code) {
    return res.sendStatus(400);
  }

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
    const { data: { access_token: accessToken } } = await httpClient({
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: querystring.stringify(body),
      url: `${config.FC_URL}${config.TOKEN_FC_PATH}`,
    });

    if (!accessToken) {
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

    // store accesstoken in session to be able to reach user's data from home page,
    // and data to be able to display them on data page
    req.session.accessToken = accessToken;
    req.session.data = data;

    return res.redirect('/data-data');
  } catch (error) {
    return next(error);
  }
};

export const getData = (req, res) => res.render('pages/data', {
  data: JSON.stringify(req.session.data, null, 2),
  dataLink: 'https://github.com/france-connect/data-provider-example/blob/master/database.csv',
});
