const name = 'user';

export default function() {
  const app = this;
  this.bind(name);
  const $ = app[name];

  $.queryUsers = async function queryUsers(opts) {
    return this.get(`/users`, opts);
  };

  $.getUserInfo = async function getUserInfo(id) {
    const uri = `/users/${id}`;
    return this.get(uri);
  };

  $.updateUserInfo = async function updateUserInfo(id, opts) {
    const uri = `/users/${id}`;
    return this.post(uri, opts);
  };

  return {
    name,
    unuse: () => {
      delete app[name];
    },
  };
}
