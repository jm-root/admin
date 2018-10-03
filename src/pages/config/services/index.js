import sdk from '@/services/sdk';

const { config } = sdk;

export async function queryConfigRoots() {
  return config.getConfigs('root:config:roots');
}

export async function queryConfigHKey(hkey) {
  return config.getConfigs(hkey);
}

export async function saveConfigValue(params) {
  const { root, key, value } = params;
  if (key) {
    return config.setConfig(root, key, value);
  }
  return config.setConfigs(root, value);
}

export async function deleteConfig(params) {
  const { root, key } = params;
  if (key) {
    return config.removeConfig(root, key);
  }
  return config.removeRoot(root);
}
