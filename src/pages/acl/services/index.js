import sdk from '@/services/sdk';

const { acl } = sdk;

import { stringify } from 'qs';

function getSSO() {
  return sdk.store.sso;
}

export async function queryAclUsers(params) {
  return acl.get(`/users?${stringify(params)}`);
}

export async function queryAclUserInfo(params) {
  return acl.get(`/users/${params.id}`);
}

export async function addAclUser(params = {}) {
  const tokenData = getSSO();
  params.creator = tokenData.id;
  return acl.post(`/users`, params);
}

export async function updateAclUserInfo(params) {
  let id = params.id;
  params.id && delete params.id;
  params._id = id;
  return acl.post(`/users/${id}`, params);
}

export async function removeAclUser(params) {
  return acl.delete(`/users/${params.id}`);
}

// 查询所有角色
export async function queryAclRoles(params) {
  return acl.get(`/roles`);
}

export async function queryUsers(params) {
  return acl.get(`/user/users?${stringify(params)}`);
}

// 查询用户角色
export async function queryAclUserRoles(params) {
  const tokenData = getSSO();
  const id = tokenData.id;
  return acl.get(`/users/${id}/roles`);
}

// 查询用户资源
export async function queryAclUserResources(params) {
  const tokenData = getSSO();
  const id = tokenData.id;
  return acl.get(`/users/${id}/resources`);
}

// 新增角色
export async function addAclRole(params) {
  const tokenData = getSSO();
  params.creator = tokenData.id;
  return acl.post(`/roles`, params);
}

// 删除角色
export async function removeAclRole(params) {
  return acl.delete(`/roles/${params.id}`);
}

// 更新角色信息
export async function updateAclRole(params) {
  return acl.post(`/roles/${params._id}`, params);
}

// 更新角色资源
export async function updateAclRoleResource(params) {
  let id = params.id;
  delete params.id;
  return acl.post(`/roles/${id}/resource`, params);
}

// 查询角色资源权限
export async function queryAclRoleResources(params) {
  let id = params.id;
  return acl.get(`/roles/${id}/resources?${stringify(params)}`);
}

// 查询所有资源树
export async function queryAclResourceTree(params) {
  return acl.get(`/resources/tree`);
}

// 新增资源
export async function addAclResource(params) {
  return acl.post(`/resources`, params);
}

// 更新资源
export async function updateAclResource(params) {
  return acl.post(`/resources/${params._id}`, params);
}

// 删除资源
export async function removeAclResource(params) {
  return acl.delete(`/resources/${params.id}`);
}
