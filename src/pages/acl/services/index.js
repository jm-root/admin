import { stringify } from 'qs';
import sdk from '@/services/sdk';

const { acl, user } = sdk;

function getSSO() {
  return sdk.store.sso;
}

// 查询所有资源树
export async function queryResources() {
  return acl.get('/resources');
}

// 保存资源
export async function saveResources(rows) {
  return acl.post('/resources', { rows });
}

// 删除资源
export async function clearResources(params) {
  return acl.delete(`/resources/${params.id}`);
}

// 查询所有角色
export async function queryRoles() {
  return acl.get('/roles');
}

// 保存角色
export async function saveRoles(rows) {
  return acl.post('/roles', { rows });
}

// 删除角色
export async function clearRoles(params) {
  return acl.delete(`/roles/${params.id}`);
}

export async function queryUsers(params) {
  return acl.get(`/users?${stringify(params)}`);
}

export async function searchUsers(params) {
  return user.get(`/users?${stringify(params)}`);
}

export async function queryAclUserInfo(params) {
  return acl.get(`/users/${params.id}`);
}

export async function addAclUser(params = {}) {
  const tokenData = getSSO();
  params.creator = tokenData.id;
  return acl.post('/users', params);
}

export async function updateAclUserInfo(params) {
  const { id } = params;
  return acl.post(`/users/${id}`, params);
}

export async function removeAclUser(params) {
  return acl.delete(`/users/${params.id}`);
}

// 查询用户角色
export async function queryAclUserRoles() {
  const tokenData = getSSO();
  const { id } = tokenData;
  return acl.get(`/users/${id}/roles`);
}

// 查询用户资源
export async function queryAclUserResources() {
  const tokenData = getSSO();
  const { id } = tokenData;
  return acl.get(`/users/${id}/resources`);
}

// 新增角色
export async function addAclRole(params) {
  const tokenData = getSSO();
  params.creator = tokenData.id;
  return acl.put(`/roles/${params.id}`, params);
}

// 删除角色
export async function removeAclRole(params) {
  return acl.delete(`/roles/${params.id}`);
}

// 更新角色信息
export async function updateAclRole(params) {
  return acl.put(`/roles/${params.id}`, params);
}

// 更新角色资源
export async function updateAclRoleResource(params) {
  const { id } = params;
  delete params.id;
  return acl.post(`/roles/${id}/resource`, params);
}

// 查询角色资源权限
export async function queryAclRoleResources(params) {
  return acl.get('/roleResources', params);
}
