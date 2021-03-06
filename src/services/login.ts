import request from '@/utils/request';
import sdk from './sdk';

export interface LoginParamsType {
  type: string;
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
}

export async function fakeAccountLogin(params: LoginParamsType) {
  const { userName, password, type } = params;
  const { acl, passport, storage, store } = sdk;
  try {
    let doc = await passport.login(userName, password);
    storage.setJson('sso', doc);
    store.sso = doc;
    const { id } = doc;
    doc = await acl.getUserRoles(id);
    const roles = ['user', ...doc];
    return {
      status: 'ok',
      type,
      currentAuthority: roles,
    };
  } catch (e) {
    console.error(e.stack);
    return {
      status: 'fail',
      type,
      currentAuthority: [],
    };
  }
}

export async function fakeLogout() {
  const { store } = sdk;
  sdk.logout();
  store.user = null;
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
