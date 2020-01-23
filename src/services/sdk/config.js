let config = {
  development: {
    api: 'http://api.test.jamma.cn',
    log_level: 'debug',
  },
  test: {
    api: 'http://api.test.jamma.cn',
  },
  production: {
    api: 'https://api.jamma.cn',
  },
};

const defaultConfig = {
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
