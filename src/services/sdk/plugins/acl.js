const name = 'acl';

export default function() {
  const app = this;
  this.bind(name);
  const $ = app[name];

  $.getUserRoles = async function getUserRoles(id) {
    let doc = await this.get(`/users/${id}/roles`);
    doc = doc.rows ? doc.rows : Object.keys(doc); // 兼容acl 0.1 和 1.0
    return doc;
  };

  return {
    name,
    unuse: () => {
      delete app[name];
    },
  };
}
