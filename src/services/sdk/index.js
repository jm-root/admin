import Sdk from 'jm-sdk';
import MS from 'jm-ms/dist/browser';
import umiRouter from 'umi/router';
import config from './config';
import user from './plugins/user';
import acl from './plugins/acl';
import onError from './onError';

const ms = new MS();
const sdk = new Sdk(config);
sdk.use(acl).use(user);

const router = ms.router();
ms.client({ uri: config.api }).then(doc => {
  router.use(doc);
  sdk.router = router;
});

const { logger } = sdk;
logger.level = config.logLevel || 'info';
logger.info('config:', config);
sdk.login = function() {
  umiRouter.push('/user/login');
  return null;
};

onError(sdk);
export default sdk;
