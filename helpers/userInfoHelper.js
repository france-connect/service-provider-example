import querystring from 'querystring';
import { httpClient } from './httpClient';
import config from '../config';

export const requestUserInfo = async (req, spConfig) => {
  // Retrieve the SP parameters
  const {
    clientId,
    clientSecret,
    redirectUri,
  } = spConfig;

  // Set request params
  const body = {
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
    client_id: clientId,
    client_secret: clientSecret,
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
    return { statusCode: 401 };
  }

  // Request user data
  const { data: user } = await httpClient({
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
    url: `${config.FC_URL}${config.USERINFO_FC_PATH}`,
  });

  return { statusCode: 200, user, idToken };
};

export const requestDataInfo = async (req, spConfig) => {
  // Retrieve the SP parameters
  const {
    clientId,
    clientSecret,
    redirectUri,
  } = spConfig;

  // Set request params
  const body = {
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
    client_id: clientId,
    client_secret: clientSecret,
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
    return { statusCode: 401 };
  }

  // Request data from data provider
  const { data } = await httpClient({
    method: 'GET',
    // Only valid if it's used with https://github.com/france-connect/data-provider-example/
    // If you want to use your own code change the url's value in the config/config.json file.
    url: `${config.FD_URL}${config.DGFIP_DATA_FD_PATH}`,
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return { statusCode: 200, data };
};
