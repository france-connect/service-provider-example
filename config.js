const config = {
  FC_URL: process.env.FC_URL || 'https://fcp.dev.dev-franceconnect.fr',
  FD_URL: process.env.FD_URL || 'https://fdp.dev.dev-franceconnect.fr',
  FS_URL: process.env.FS_URL || 'http://localhost:3000',
  CLIENT_ID: process.env.CLIENT_ID || 'a0cd64372db6ecf39c317c0c74ce90f02d8ad7d510ce054883b759d666a996bc',
  CLIENT_SECRET: process.env.CLIENT_SECRET || 'a970fc88b3111fcfdce515c2ee03488d8a349e5379a3ba2aa48c225dcea243a5',
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
