import request from '@/utils/request';
import sdk from './sdk';

const { user, store } = sdk;

export async function query(): Promise<any> {
  return user.queryUsers();
}

export async function queryCurrent(): Promise<any> {
  if (!store.user) {
    const sso = await sdk.checkLogin();
    if (sso && sso.id) {
      const { id } = sso;
      store.user = await user.getUserInfo(id);
    }
  }
  if (!store.user) return null;
  const currentUser = store.user || {};
  return {
    ...currentUser,
    name: currentUser.nick || currentUser.account,
    userid: currentUser.id,
  };
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}
