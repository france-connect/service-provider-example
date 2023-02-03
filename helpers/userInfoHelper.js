import { URLSearchParams } from 'url';
import { httpClient } from './httpClient';
import config from '../config';

export const requestToken = async (spConfig) => {
  // Retrieve the SP parameters
  const {
    clientId,
    clientSecret,
    code,
    redirectUri,
  } = spConfig;

  // Set request params
  const body = {
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
    client_id: clientId,
    client_secret: clientSecret,
    code,
  };

  // Request access token.
  const data = new URLSearchParams(body).toString();
  const { data: { access_token: accessToken, id_token: idToken } } = await httpClient({
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data,
    url: `${config.FC_URL}${config.TOKEN_FC_PATH}`,
  });

  return { accessToken, idToken };
};

export const requestUserInfo = async (accessToken) => {
  const { data } = await httpClient({
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
    url: `${config.FC_URL}${config.USERINFO_FC_PATH}`,
  });

  return data;
};

export const requestDataInfo = async (accessToken) => {
  const { data } = await httpClient({
    method: 'GET',
    // Only valid if it's used with https://github.com/france-connect/data-provider-example/
    // If you want to use your own code change the url's value in the config/config.json file.
    url: `${config.FD_URL}${config.DGFIP_DATA_FD_PATH}`,
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return data;
};

export const requestTracksDataInfo = async (accessToken) => {
  const { data } = await httpClient({
    method: 'GET',
    // Only valid if it's used with https://github.com/france-connect/data-provider-example/
    // If you want to use your own code change the url's value in the config/config.json file.
    url: `${config.TRACKS_DATA_URL}${config.TRACKS_DATA_PATH}`,
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return data;
};
