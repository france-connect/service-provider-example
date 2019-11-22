import Joi from '@hapi/joi';
import config from '../config';
import { QUERY_ERROR_REGEX } from '../helpers/utils';

/**
 *  Display basic login page with possible errors from auth callback
 * @param {Express.req} req
 * @param {Express.res} res
 */
export const getLogin = (req, res) => {
  // 1 - get only the interesting params
  const { query, params, body } = req;
  const inputs = { query, params, body };

  // 2 - define how the params should be.
  const loginSchema = Joi.object({
    query: {
      error: Joi.string()
        .valid(...Object.keys(config.OPENID_ERRORS))
        .optional(),
      error_description: Joi.string()
        .regex(QUERY_ERROR_REGEX)
        .optional(),
    },
    body: Joi.object().length(0),
    params: Joi.object().length(0),
  });

  // 3 - validate the inputs
  const { error: inputsError, value } = loginSchema.validate(inputs);

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
    query: { error, error_description: errorDescription },
  } = value;

  // 6 - we edit the login with error
  const data = {};
  let status = 200;
  if (error) {
    status = 400;
    const errorTitle = config.OPENID_ERRORS[error] || 'erreur inconnue';
    Object.assign(data, { status, error: errorTitle, errorDescription });
  }

  return res.status(status).render('pages/login', data);
};
