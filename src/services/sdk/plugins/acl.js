const name = 'acl';

export default function() {
  const app = this;
  this.bind(name);
  const $ = app[name];

  $.getUserRoles = async function getUserRoles(id) {
    return this.get(`/users/${id}/roles`);
  };

  return {
    name,
    unuse: () => {
      delete app[name];
    },
  };
}
