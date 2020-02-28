// eslint-disable-next-line import/no-extraneous-dependencies
import nock from 'nock';
import { matches } from 'lodash';
import config from '../../config';

// POST https://fcp.dev.dev-franceconnect.fr/api/v1/token
const base64EncodedJwtPayload = Buffer.from('{'
  + '"iss":"https://fcp.dev.dev-franceconnect.fr",'
  + '"sub":"54ec12223fcaf10189cacb7111a24ef358539ff9dc550952c4279d9f57e6d7bdv1",'
  + '"aud":"a0cd64372db6ecf39c317c0c74ce90f02d8ad7d510ce054883b759d666a996bc",'
  + '"exp":1540222853,'
  + '"iat":1540221653,'
  + '"nonce":"customNonce11",'
  + '"idp":"FC",'
  + '"acr":"eidas2",'
  + '"amr":[]'
  + '}').toString('base64');

// get https://fcp.dev.dev-franceconnect.fr/api/v1/token
export const validTokenConf = {
  reponseHttpStatusCode: 200,
  requestHeaders: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  requestBodyQuery: {
    grant_type: 'authorization_code',
    redirect_uri: `${config.FS_URL}${config.LOGIN_CALLBACK_FS_PATH}`, // encodeURIComponent(`${config.FS_URL}${config.LOGIN_CALLBACK_FS_PATH}`),
    client_id: config.CLIENT_ID,
    client_secret: config.CLIENT_SECRET,
    code: 'f272e27c-0d47-11ea-9a9f-362b9e155667',
  },
  responseBody: {
    access_token: 'ae3b27ba14bdc9f864f5c5e396b507c1c1064fc951eb68bb8bab6283e81e7d75',
    token_type: 'Bearer',
    expires_in: 1200,
    id_token: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.${base64EncodedJwtPayload}.HdDfA3QSqa4ZoF_y1aS62p2LBVUM6quKFfSluF0mSy4`,
  },
};
export const invalidTokenConf = {
  reponseHttpStatusCode: 400,
  requestHeaders: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  requestBodyQuery: {
    grant_type: 'authorization_code',
    redirect_uri: `${config.FS_URL}${config.LOGIN_CALLBACK_FS_PATH}`, // encodeURIComponent(`${config.FS_URL}${config.LOGIN_CALLBACK_FS_PATH}`),
    client_id: config.CLIENT_ID,
    client_secret: config.CLIENT_SECRET,
    code: 'invalid-code%',
  },
  responseBody: { status: 'fail', message: 'invalid_grant' },
};

// get https://fcp.dev.dev-franceconnect.fr/api/v1/userinfo
export const validUserInfoConf = {
  reponseHttpStatusCode: 200,
  requestHeaders: {
    Authorization: 'Bearer ae3b27ba14bdc9f864f5c5e396b507c1c1064fc951eb68bb8bab6283e81e7d75',
  },
  responseBody: {
    sub: '54ec12223fcaf10189cacb7111a24ef358539ff9dc550952c4279d9f57e6d7bdv1',
    _claim_names: {},
    _claim_sources: {
      src1: {
        JWT: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.Int9Ig.uJPwtftRcQEhR2JYi4rIetaSA1nVt2g0oI3dZnB3yts',
      },
    },
    given_name: 'Melaine',
    family_name: 'TROIS',
    gender: 'female',
    birthdate: '1981-07-27',
    preferred_username: 'MELAINETROIS',
    birthplace: '',
    birthcountry: '99100',
  },
};

// This will intercepts every calls made to france connect server and returns a mocked response
export const initializeMocks = () => {
  nock(config.FC_URL)
    .persist()
    .post(config.TOKEN_FC_PATH, matches({ code: validTokenConf.requestBodyQuery.code }))
    .reply(validTokenConf.reponseHttpStatusCode, validTokenConf.responseBody);

  nock(config.FC_URL)
    .persist()
    .post(config.TOKEN_FC_PATH, matches({ code: invalidTokenConf.requestBodyQuery.code }))
    .reply(invalidTokenConf.reponseHttpStatusCode, invalidTokenConf.responseBody);

  nock(config.FC_URL)
    .persist()
    .get(config.USERINFO_FC_PATH)
    .reply(validUserInfoConf.reponseHttpStatusCode, validUserInfoConf.responseBody);
};

export const cleanMocks = nock.cleanAll;
