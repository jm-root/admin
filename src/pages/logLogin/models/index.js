import data from '../services/generate_data';

const list = data;

function* effectList({ payload = {} }, { call, put }) {
  const { search } = payload;
  let rows = list;
  if (search) {
    rows = [];
    list.forEach(doc => {
      const { account, name } = doc;
      if (account.indexOf(search) === -1 && name.indexOf(search) === -1) return;
      rows.push(doc);
    });
  }
  yield put({
    type: 'queryList',
    payload: {
      list: rows,
    },
  });
}

export default {
  namespace: 'logLogin',

  state: {
    data: {
      list: [],
    },
  },

  effects: {
    list: effectList,
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
