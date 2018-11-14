const config = {
  FC_URL: process.env.FC_URL || 'https://fcp.integ01.dev-franceconnect.fr',
  FD_URL: process.env.FD_URL || 'https://data-provider-example.herokuapp.com',
  FS_URL: process.env.FS_URL || 'http://localhost:3000',
  AUTHENTICATION_CLIENT_ID: process.env.CLIENT_ID || '2e5eaafcf2e1f0be4f8a6e1a03135ee1aac4a30412a6e243bce044da1a0726b4',
  AUTHENTICATION_CLIENT_SECRET: process.env.CLIENT_SECRET || '46cf9cb60cdd448be9937fbda8275321ab811e8587bdbb76c7fe3342370c2aff',
  DATA_CLIENT_ID: process.env.DATA_CLIENT_ID || '2d166753b14d5c8c334642ea1de1d2c3988d14bcf1fe8c79182cdc42e31ec7e0',
  DATA_CLIENT_SECRET: process.env.DATA_CLIENT_SECRET || '3a74047cb61178e8a15d4dd00065fb54ca0aeab815d61d94863a8792450c9821',
  FRANCE_CONNECT_KIT_PATH: '/js/franceconnect.js',
  AUTHORIZATION_FC_PATH: '/api/v1/authorize',
  TOKEN_FC_PATH: '/api/v1/token',
  USERINFO_FC_PATH: '/api/v1/userinfo',
  LOGOUT_FC_PATH: '/api/v1/logout',
  LOGIN_CALLBACK_FS_PATH: '/login-callback',
  DATA_CALLBACK_FS_PATH: '/data-callback',
  LOGOUT_CALLBACK_FS_PATH: '/logout-callback',
  MANDATORY_SCOPES: 'openid',
  FC_SCOPES: 'profile birth',
  DGFIP_SCOPES: 'dgfip_revenu_fiscal_de_reference_n_moins_1 dgfip_adresse_fiscale_de_taxation_n_moins_1',
  DGFIP_DATA_FD_PATH: '/api/dgfip',
};


export default config;
