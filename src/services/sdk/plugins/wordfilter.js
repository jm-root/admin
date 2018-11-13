const name = 'wordfilter';

export default function() {
  const app = this;
  this.bind(name);
  const $ = app[name];

  $.list = async function(opts) {
    return this.get(`/words`, opts);
  };

  $.create = async function(opts) {
    return this.post(`/words`, opts);
  };

  $.remove = async function(id) {
    return this.delete(`/words?id=${id}`);
  };

  return {
    name,
    unuse: () => {
      delete app[name];
    },
  };
}
