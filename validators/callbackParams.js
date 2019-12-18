import Joi from '@hapi/joi';
import { readdirSync } from 'fs';
import { QUERY_ERROR_REGEX, QUERY_CODE_REGEX } from '../helpers/utils';
import config from '../config';

/**
 * Get error's title translated from locales files
 * @param {*} key the code of the error
 * @param {*} langs the languages available from the request
 */
const getErrorTitle = (key, langs) => {
  const [isoLang = 'fr-FR'] = langs || [];
  const availableLang = readdirSync('i18n').map(file => file.split('.')[1]);
  const selectedLang = availableLang.find(lang => isoLang.startsWith(lang.toLowerCase())) || 'fr';

  // eslint-disable-next-line global-require, import/no-dynamic-require
  const { default: { OPENID_ERRORS: errors = {} } } = require(`../i18n/locale.${selectedLang}`);
  return errors[key] || 'erreur inconnue';
};

/**
 * OpenID Connect standard errors
 * @see @link{https://www.rfc-editor.org/rfc/rfc6749.html#section-4.1.2.1}
 * the present idea is to show you a case: the treatment of a negative
 * return of the authentication process with FranceConnect.
 * The error you will get will contain an error name (here error) and a
 * description of the error, for more details about it (error_description).
 * We use Joi, the famous data validation library to simplify verification
 * of the return request.
 */
export const callbackParamsValidatorMiddleware = (req, res, next) => {
  // 1 - get only the interesting params
  const { query, params, body } = req;
  const inputs = { query, params, body };

  // 2 - define how the params should be.
  const callbackSchema = Joi.object({
    query: {
      error: Joi.string()
        .valid(...config.OPENID_ERRORS)
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
    return res.status(status).render('pages/error.ejs', {
      status,
      error: 'Bad request',
      errorDescription: "La requête n'est pas correctement formatée",
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
    const errorTitle = getErrorTitle(error, req.acceptsLanguages());
    const data = { status, error: errorTitle, errorDescription };
    return res.status(status).render('pages/error.ejs', data);
  }

  // 7 - if the request doesn't contain Authorization code we display an error
  if (!code) {
    const status = 400;
    return res.status(status).render('pages/error.ejs', {
      status,
      error: 'Bad request',
      errorDescription: "La requête n'est pas correctement formatée",
    });
  }

  // 8 - everything is good
  return next();
};
