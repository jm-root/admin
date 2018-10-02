let config = {
  development: {
    api: 'http://localhost:8000/api',
    log_level: 'debug',
  },
  test: {
    api: 'https://api.test.jamma.cn',
  },
  production: {
    api: 'https://api.jamma.cn',
  },
};

const defaultConfig = {
  title: 'Admin',
  copyright: '2018',
  logLevel: 'debug',
  modules: {
    config: {},
    sso: {},
    passport: {},
    login: {},
  },
};
const env = process.env.NODE_ENV || 'development';
config = config[env] || config.development;
config.env = env;

export default Object.assign({}, defaultConfig, config);
