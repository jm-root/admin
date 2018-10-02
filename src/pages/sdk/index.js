import Sdk from 'jm-sdk';
import MS from 'jm-ms/dist/browser';
import umiRouter from 'umi/router';
import config from './config';

const ms = new MS();
const sdk = new Sdk(config);
const router = ms.router();
ms.client({ uri: config.api }).then(doc => {
  router.use(doc);
  sdk.router = router;
});

const { logger } = sdk;
logger.level = config.logLevel || 'info';
logger.info('config:', config);
sdk.login = function() {
  return {};
};

sdk.on('error', (e, opts) => {
  logger.debug('request:', opts);
  logger.error(e);
  if (e.data && e.data.err === 401) {
    umiRouter.push('/user/login');
  }
  return null;
});
export default sdk;
