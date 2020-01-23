/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-expressions */
import { message } from 'antd';
import * as Api from '../services';

export default {
  namespace: 'acl',

  state: {
    resources: [],
    roles: [],

    userList: {},
    users: {},
    userInfo: {},
    userRoles: {},
    perRoles: [],
    resourcePer: {},
  },

  effects: {
    *queryResources({ payload, callback }, { call, put }) {
      const response = yield call(Api.queryResources, payload);
      if (!response) return;
      if (response.err) {
        message.error(response.msg);
        return;
      }
      const rows = response.rows || [];
      yield put({
        type: 'save',
        payload: { resources: rows },
      });
      callback && callback(rows);
    },

    *saveResources({ payload, callback }, { call }) {
      const response = yield call(Api.saveResources, payload);
      if (!response) return;
      if (response.err) {
        message.error(response.msg);
        return;
      }
      message.success('保存成功');
      callback && callback(payload);
    },

    *clearResources({ payload, callback }, { call }) {
      const response = yield call(Api.clearResources, payload);
      if (!response) return;
      if (response.err) {
        message.error(response.msg);
        return;
      }
      message.success('删除成功');
      callback && callback(payload);
    },

    *queryRoles({ payload, callback }, { call, put }) {
      const response = yield call(Api.queryRoles, payload);
      if (!response) return;
      if (response.err) {
        message.error(response.msg);
        return;
      }
      const roles = response.rows || [];
      yield put({
        type: 'save',
        payload: { roles },
      });
      callback && callback(roles);
    },

    *saveRoles({ payload, callback }, { call }) {
      const response = yield call(Api.saveRoles, payload);
      if (!response) return;
      if (response.err) {
        message.error(response.msg);
        return;
      }
      message.success('保存成功');
      callback && callback(payload);
    },

    *clearRoles({ payload, callback }, { call }) {
      const response = yield call(Api.clearRoles, payload);
      if (!response) return;
      if (response.err) {
        message.error(response.msg);
        return;
      }
      message.success('删除成功');
      callback && callback(payload);
    },

    *queryUsers({ payload, callback }, { call, put }) {
      const response = yield call(Api.queryUsers, payload);
      if (!response) return;
      if (response.err) {
        message.error(response.msg);
        return;
      }
      yield put({
        type: 'save',
        payload: { userList: response },
      });
      callback && callback(response);
    },

    *searchUsers({ payload, callback }, { call, put }) {
      const response = yield call(Api.searchUsers, payload);
      if (!response) return;
      if (response.err) {
        message.error(response.msg);
        return;
      }
      for (const item of response.rows) {
        item._id && (item.id = item._id);
      }
      yield put({
        type: 'save',
        payload: { users: response },
      });
      callback && callback(response);
    },

    *queryAclUserInfo({ payload, callback }, { call, put }) {
      const response = yield call(Api.queryAclUserInfo, payload);
      if (!response) return;
      if (response.err) {
        message.error(response.msg);
        return;
      }
      yield put({
        type: 'save',
        payload: { userInfo: response },
      });
      callback && callback(response);
    },
    *addAclUser({ payload, callback }, { call }) {
      const response = yield call(Api.addAclUser, payload);
      if (!response) {
        message.error('创建失败');
        return;
      }
      if (response.err) {
        message.error(response.msg);
        return;
      }
      callback && callback(response);
      message.success('创建成功');
    },
    *updateAclUserInfo({ payload, callback }, { call, put }) {
      const id = payload.id;
      const response = yield call(Api.updateAclUserInfo, payload);
      if (!response) {
        message.error('修改失败');
        return;
      }
      if (response.err) {
        message.error(response.msg);
        return;
      }
      const response1 = yield call(Api.queryAclUserInfo, { id });
      if (!response1) {
        message.error('修改失败');
        return;
      }
      if (response1.err) {
        message.error(response1.msg);
        return;
      }
      yield put({
        type: 'save',
        payload: { userInfo: response1 },
      });
      callback && callback(response1);
      message.success('修改成功');
    },
    *removeAclUser({ payload, callback }, { call, put }) {
      const response = yield call(Api.removeAclUser, payload);
      if (!response) {
        message.error('删除失败');
        return;
      }
      if (response.err) {
        message.error(response.msg);
        return;
      }
      const response1 = yield call(Api.queryUsers, payload);
      if (!response1) {
        message.error('删除失败');
        return;
      }
      if (response1.err) {
        message.error(response1.msg);
        return;
      }
      yield put({
        type: 'save',
        payload: { userList: response1 },
      });
      if (response.ret > 0) {
        callback && callback(response);
        message.success('删除成功');
      }
    },
    *queryAclUserRoles({ payload, callback }, { call, put }) {
      const response = yield call(Api.queryAclUserRoles, payload);
      if (!response) return;
      if (response.err) {
        message.error(response.msg);
        return;
      }
      yield put({
        type: 'save',
        payload: { userRoles: response },
      });
      callback && callback(response);
    },
    *queryAclUserPerRoles({ payload, callback }, { call, put }) {
      const { rows: userRoles } = yield call(Api.queryAclUserRoles, payload);
      if (!userRoles) return;
      if (userRoles.err) {
        message.error(userRoles.msg);
        return;
      }
      const result = yield call(Api.queryRoles, payload);
      if (!result) return;
      if (result.err) {
        message.error(result.msg);
        return;
      }
      const roles = result.rows || [];
      const perRoles = [];
      roles.forEach(item => {
        // 过滤自身的角色
        if (!userRoles.includes(item.id)) {
          perRoles.push(item);
        }
      });
      yield put({
        type: 'save',
        payload: { userRoles: {}, perRoles },
      });
      callback && callback(perRoles);
    },
    *queryAclResourcePer({ payload, callback }, { call, put }) {
      const response = yield call(Api.queryAclRoleResources, payload);
      if (!response) return;
      if (response.err) {
        message.error(response.msg);
        return;
      }
      yield put({
        type: 'save',
        payload: { resourcePer: response },
      });
      callback && callback(response);
    },

    *addAclRole({ payload, callback }, { call }) {
      const response = yield call(Api.addAclRole, payload);
      if (!response) return;
      if (response.err) {
        message.error(response.msg);
        return;
      }
      message.success('创建成功');
      payload.id = response.id;
      callback && callback(payload);
    },
    *updateAclRole({ payload, callback }, { call }) {
      const response = yield call(Api.updateAclRole, payload);
      if (!response) return;
      if (response.err) {
        message.error(response.msg);
        return;
      }
      message.success('更新成功');
      callback && callback(payload);
    },
    *removeAclRole({ payload, callback }, { call }) {
      const response = yield call(Api.removeAclRole, payload);
      if (!response) return;
      if (response.err) {
        message.error(response.msg);
        return;
      }
      message.success('删除成功');
      callback && callback(payload);
    },
    *updateAclRoleResource({ payload, callback }, { call }) {
      const response = yield call(Api.updateAclRoleResource, payload);
      if (!response) return;
      if (response.err) {
        message.error(response.msg);
        return;
      }
      message.success('更新成功');
      callback && callback(payload);
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
