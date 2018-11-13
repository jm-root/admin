const name = 'log';

export default function() {
  const app = this;
  this.bind(name);
  const $ = app[name];

  $.list = async function(opts) {
    return this.get(`/logs`, opts);
  };

  $.create = async function(opts) {
    return this.post(`/logs`, opts);
  };

  $.remove = async function(id) {
    return this.delete(`/logs?id=${id}`);
  };
  return {
    name,
    unuse: () => {
      delete app[name];
    },
  };
}
