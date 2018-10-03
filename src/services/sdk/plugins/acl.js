const name = 'acl';

module.exports = function() {
  const app = this;
  this.bind(name);
  const $ = app[name];

  $.getUserRoles = async function(id) {
    return this.get(`/users/${id}/roles`);
  };

  return {
    name,
    unuse: () => {
      delete app[name];
    },
  };
};
