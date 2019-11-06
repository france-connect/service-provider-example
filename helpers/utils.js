export const getAcrFromIdToken = idToken => (
  JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString('utf8')).acr
);


/**
 * Can translate a character into encodable for the web: " " -> "% 20"
 * @param {string} x character to encode
 */
const percentialize = x => `%${x.charCodeAt(0).toString(16).toUpperCase()}`;
/**
 * Equivalent of the encodeURIComponent function but compatible with the RFC3986 standard
 * @param {string} s string to encode for the Web
 */
const rfc3986EncodeURIComponent = s => encodeURIComponent(s).replace(/[!'()*]/g, percentialize);

/**
 * Used to serialize an object in standard URL parameters
 * @param {Object} params objet à transformer
 */
export const transformParams = params => Object.entries(params).map(([k, v]) => `${rfc3986EncodeURIComponent(k)}=${rfc3986EncodeURIComponent(v)}`).join('&');

/**
 * @description regex that test the Error Description in URL
 */
// eslint-disable-next-line no-useless-escape
export const QUERY_ERROR_REGEX = /^[\+&=#@;\,\w\\'áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ. \t-]{1,500}$/;
