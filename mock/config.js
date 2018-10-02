export default {
  '/api/config/root:config:roots': {
    gateway: { title: '路由' },
  },
  '/api/config/gateway': {
    modules: {
      acl: {
        proxy: 'http://acl.wyb.rancher.internal/acl',
      },
      sso: {
        proxy: 'http://sso.wyb.rancher.internal/sso',
      },
    },
  },
};
