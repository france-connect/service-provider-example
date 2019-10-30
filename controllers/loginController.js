import config from '../config';
/**
 *  Display basic login page with possible errors from auth callback
 * @param {Express.req} req
 * @param {Express.res} res
 */
export const getLogin = (req, res) => {
  /**
   * OpenID Connect standard errors
   * @see @link{https://www.rfc-editor.org/rfc/rfc6749.html#section-4.1.2.1}
   */
  const {
    query: {
      error,
      error_description: errorDescription,
    },
  } = req;

  const data = {};
  if (error) {
    const format = config.OPENID_ERRORS[error] || 'erreur inconnue';
    Object.assign(data, { error: format, errorDescription });
  }

  return res.render('pages/login', data);
};
