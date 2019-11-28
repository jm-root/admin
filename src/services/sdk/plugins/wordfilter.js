const name = 'wordfilter';

export default function() {
  const app = this;
  this.bind(name);
  const $ = app[name];

  $.list = async function list(opts) {
    return this.get('/words', opts);
  };

  $.create = async function create(opts) {
    return this.post('/words', opts);
  };

  $.remove = async function remove(id) {
    return this.delete(`/words?id=${id}`);
  };

  return {
    name,
    unuse: () => {
      delete app[name];
    },
  };
}
