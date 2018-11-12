const config = {
  FC_URL: process.env.FC_URL || 'https://fcp.integ01.dev-franceconnect.fr',
  FD_URL: process.env.FD_URL || 'https://data-provider-example.herokuapp.com',
  FS_URL: process.env.FS_URL || 'http://localhost:3000',
  CLIENT_ID: process.env.CLIENT_ID || 'c48ff5ae96e870f507507555f7bc4dd361d2aac31df219fe6e92bbcca65f73f5',
  CLIENT_SECRET: process.env.CLIENT_SECRET || '8f373c6e6a48ce0f5931f414b6739e4e0aa82eda20a083dc5c0522b6c691b17b',
  FRANCE_CONNECT_KIT_PATH: '/js/franceconnect.js',
  AUTHORIZATION_FC_PATH: '/api/v1/authorize',
  TOKEN_FC_PATH: '/api/v1/token',
  USERINFO_FC_PATH: '/api/v1/userinfo',
  LOGOUT_FC_PATH: '/api/v1/logout',
  CALLBACK_FS_PATH: '/callback',
  LOGOUT_FS_PATH: '/logged-out',
  SCOPES: 'openid profile birth dgfip_revenu_fiscal_de_reference_n_moins_1 dgfip_adresse_fiscale_de_taxation_n_moins_1',
  DGFIP_DATA_FD_PATH: '/api/dgfip',
};


export default config;
