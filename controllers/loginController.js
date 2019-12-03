/**
 *  Display basic login page with possible errors from auth callback
 * @param {Express.req} req
 * @param {Express.res} res
 */
export const getLogin = (req, res) => res.status(200).render('pages/login', {});
