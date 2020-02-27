export const getPayloadOfIdToken = (idToken) => {
  const [, payload = ''] = idToken.split('.');
  const decodedPayload = Buffer.from(payload, 'base64').toString('utf8');
  return JSON.parse(decodedPayload);
};

/**
 * @description regex that test the Error Description in URL
 * We accept:
 * - \w all the basic character A-Za-z0-9
 * - all specials characters like +&=#@;-.,'
 * - all accents like àéếù....
 * - the space character and tab (" " and \t)
 * - miminum 1 character and maximum 500
 */
// eslint-disable-next-line no-useless-escape
export const QUERY_ERROR_REGEX = /^[\+&=#@;\,\w\\'áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ. \t-]{1,500}$/;

/**
 * @description regex that test the Code URL from FC
 * We accept
 * - basics alphanumeric characters
 * - dashs
 * - underscores
 * - minimum 1 characters and maximum 100 characters
 */
export const QUERY_CODE_REGEX = /^[a-z0-9_-]{10,100}$/i;
