export const getAcrFromIdToken = idToken => (
  JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString('utf8')).acr
);

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
 * We accept UUID v1 code :
 * - 8 hexadecimal digits
 * - 4 hexadecimal digits
 * - 4 hexadecimal digits (first 0 to 5 and then 3 others)
 * - 4 hexadecimal digits (first 0 or 8 or 9 or a or b and then 3 others)
 * - 12 hexadecimal digits
 */
export const QUERY_CODE_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
