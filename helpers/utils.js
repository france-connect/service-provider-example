export const getAcrFromIdToken = idToken => (
  JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString('utf8')).acr
);


/**
 * Permet de traduire un caractère en encodable pour le web " " -> "%20"
 * @param {string} x character à encoder
 */
const percentialize = x => `%${x.charCodeAt(0).toString(16).toUpperCase()}`;
/**
 * Equivalent de la fonction encodeURIComponent mais compatible avec le norme RFC3986
 * @param {string} s chaine de caractère à encoder pour le web
 */
const rfc3986EncodeURIComponent = s => encodeURIComponent(s).replace(/[!'()*]/g, percentialize);

/**
 * Permet de sérialiser un objet standard en paramètres d'URL
 * @param {Object} params objet à transformer
 */
export const transformParams = params => Object.entries(params).map(([k, v]) => `${rfc3986EncodeURIComponent(k)}=${rfc3986EncodeURIComponent(v)}`).join('&');

/**
 * @description regex permettant de tester le texte de description d'erreur
 * @example j\'ai trouvé + d\'une erreur & 200 cul-de-sac = un problème #grave \
 * @franceconnect; and what else ...
 */
// eslint-disable-next-line no-useless-escape
export const QUERY_ERROR_REGEX = /^[\+&=#@;\,\w\\'áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ. \t-]{1,500}$/;
