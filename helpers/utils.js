export const getAcrFromIdToken = idToken => (
  JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString('utf8')).acr
);

/**
 * @description regex that test the Error Description in URL
 */
// eslint-disable-next-line no-useless-escape
export const QUERY_ERROR_REGEX = /^[\+&=#@;\,\w\\'áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ. \t-]{1,500}$/;

/**
 * @description regex that test the Code URL from FC
 */
export const QUERY_CODE_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
