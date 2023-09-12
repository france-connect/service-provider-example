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

/**
 * List of groups of scopes to help in login
 */
export const SCOPES_GROUPS = {
  list: [
    'openid',
    'given_name',
    'family_name',
    'gender',
    'preferred_username',
    'idp_birthdate',
    'birthdate',
    'birthcountry',
    'birthplace',
    'email',
    'address',
    'phone',
    'profile',
    'identite_pivot',
    'birth',
    'dgfip_rfr',
    'dgfip_nbpart',
    'dgfip_sitfam',
    'dgfip_pac',
    'dgfip_aft',
    'cnam_paiements_ij',
    'connexion_tracks',
    'amr',
  ],
  all: [
    'openid',
    'email',
    'address',
    'phone',
    'birthcountry',
    'birthplace',
    'birthdate',
    'given_name',
    'family_name',
    'gender',
    'preferred_username',
  ],
  profile: [
    'openid',
    'given_name',
    'family_name',
    'preferred_username',
    'birthdate',
    'gender',
  ],
  identity: [
    'openid',
    'given_name',
    'family_name',
    'preferred_username',
    'birthdate',
    'gender',
    'birthplace',
    'birthcountry',
  ],
  birth: ['openid', 'birthplace', 'birthcountry'],
  anonymous: ['openid'],
  none: [],
  data: [
    'openid',
    'dgfip_rfr',
    'dgfip_nbpart',
    'dgfip_sitfam',
    'dgfip_pac',
    'dgfip_aft',
    'cnam_paiements_ij',
  ],
  tracks: [
    'openid',
    'connexion_tracks',
  ],
};

export const containsDataScopes = (scope) => SCOPES_GROUPS.data
  .filter((s) => s !== 'openid')
  .some((dataScope) => scope && scope.includes(dataScope));

export const containsTracksScopes = (scope) => SCOPES_GROUPS.tracks
  .filter((s) => s !== 'openid')
  .some((tracksScope) => scope && scope.includes(tracksScope));
