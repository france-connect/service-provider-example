/**
 * Helper to get an access token from France Connect.
 * @see @link{ https://partenaires.franceconnect.gouv.fr/fcp/fournisseur-service# }
 */
import Joi from '@hapi/joi';
import querystring from 'querystring';
import { httpClient } from '../helpers/httpClient';
import config from '../config';
import {
  getAcrFromIdToken,
  QUERY_ERROR_REGEX,
  QUERY_CODE_REGEX,
} from '../helpers/utils';

/**
 * Format the url use in the redirection call
 * to the France Connect Authorization and logout API endpoint.
 * @see @link{ https://partenaires.franceconnect.gouv.fr/fcp/fournisseur-service# }
 */
export const oauthLoginAuthorize = (req, res) => {
  const eidasQueryString = req.body.eidasLevel
    ? `&acr_values=${req.body.eidasLevel}`
    : '';

  return res.redirect(
    `${config.FC_URL}${config.AUTHORIZATION_FC_PATH}?`
      + `response_type=code&client_id=${config.AUTHENTICATION_CLIENT_ID}&redirect_uri=${config.FS_URL}`
      + `${config.LOGIN_CALLBACK_FS_PATH}&scope=${config.MANDATORY_SCOPES} ${config.FC_SCOPES}&state=home&nonce=customNonce11`
      + `${eidasQueryString}`,
  );
};

/**
 * Init FranceConnect authentication login process.
 * Make every http call to the different API endpoints.
 */
export const oauthLoginCallback = async (req, res, next) => {
  /**
   * OpenID Connect standard errors
   * @see @link{https://www.rfc-editor.org/rfc/rfc6749.html#section-4.1.2.1}
   *
   * l'idée ici présente est de vous montrer un cas de figure: le traitement d'un retour
   * négatif de la procédure d'authentification avec FranceConnect. l'erreur que vous
   * recevrez contiendra un nom d'erreur (ici error) et un description de l'erreur, précisant
   * la démarche (error_descrition). Nous utilisons Joi, célèbre bibliothèque de validation
   * de données pour simplifier la vérification de la requête de retour.
   */

  // 1 - get only the interesting params
  const { query, params, body } = req;
  const inputs = { query, params, body };

  // 2 - define how the params should be.
  const callbackSchema = Joi.object({
    query: {
      error: Joi.string()
        .valid(...Object.keys(config.OPENID_ERRORS))
        .optional(),
      error_description: Joi.string()
        .regex(QUERY_ERROR_REGEX)
        .optional(),
      code: Joi.string()
        .regex(QUERY_CODE_REGEX)
        .optional(),
      state: Joi.string()
        .regex(/^[0-9a-zA-Z]+$/)
        .optional(),
    },
    body: Joi.object().length(0),
    params: Joi.object().length(0),
  });

  // 3 - validate the inputs
  const { error: inputsError, value } = callbackSchema.validate(inputs);

  // 4 - if the validation failed, this is a bad request
  if (inputsError) {
    const status = 400;
    return res.status(status).render('pages/error/4xx.ejs', {
      status,
      error: 'Bad request',
      errorDescription: "La requête n'est pas correctement formattée",
    });
  }


  // 5 - we grab the meaningful params
  const {
    query: { code, error, error_description: errorDescription },
  } = value;

  /**
   * @throws the request is not authorized
   * @see https://www.rfc-editor.org/rfc/rfc6749.html#section-4.1.2.1
   */

  // 6 - we redirect with an error page
  if (error) {
    const status = 403;
    const errorTitle = config.OPENID_ERRORS[error] || 'erreur inconnue';
    const data = { status, error: errorTitle, errorDescription };
    return res.status(status).render('pages/error/4xx.ejs', data);
  }

  // 7 - if the request doesn't contain Authorization code we display an error
  if (!code) {
    const status = 400;
    return res.status(status).render('pages/error/4xx.ejs', {
      status,
      error: 'Bad request',
      errorDescription: "La requête n'est pas correctement formattée",
    });
  }

  try {
    // Set request params
    const bodyRequest = {
      grant_type: 'authorization_code',
      redirect_uri: `${config.FS_URL}${config.LOGIN_CALLBACK_FS_PATH}`,
      client_id: config.AUTHENTICATION_CLIENT_ID,
      client_secret: config.AUTHENTICATION_CLIENT_SECRET,
      code: req.query.code,
    };

    // Request access token.
    const {
      data: { access_token: accessToken, id_token: idToken },
    } = await httpClient({
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: querystring.stringify(bodyRequest),
      url: `${config.FC_URL}${config.TOKEN_FC_PATH}`,
    });

    if (!accessToken || !idToken) {
      return res.sendStatus(401);
    }

    // Request user data
    const { data: user } = await httpClient({
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
      url: `${config.FC_URL}${config.USERINFO_FC_PATH}`,
    });

    // Store the user in session so it is available for future requests
    // as the idToken for Logout, and the context
    req.session.user = user;
    req.session.context = { acr: getAcrFromIdToken(idToken) };
    req.session.idToken = idToken;

    return res.redirect('/user');
  } catch (errorToken) {
    return next(errorToken);
  }
};

export const getUser = (req, res) => res.render('pages/data', {
  user: req.session.user,
  data: JSON.stringify(req.session.user, null, 2),
  context: JSON.stringify(req.session.context, null, 2),
  dataLink:
      'https://github.com/france-connect/identity-provider-example/blob/master/database.csv',
});

/**
 * Format the url 's that is used in a redirect call to France Connect logout API endpoint
 * @returns {string}
 */
export const oauthLogoutAuthorize = (req, res) => {
  const {
    session: { idToken },
  } = req;

  return res.redirect(
    `${config.FC_URL}${config.LOGOUT_FC_PATH}?id_token_hint=`
      + `${idToken}&state=customState11&post_logout_redirect_uri=${config.FS_URL}`
      + `${config.LOGOUT_CALLBACK_FS_PATH}`,
  );
};

export const oauthLogoutCallback = (req, res) => {
  // Empty session
  req.session.destroy();

  return res.redirect('/');
};
