import sdk from '@/services/sdk';

const {
  wordfilter,
  wordfilter: { list, create, remove },
} = sdk;

function* effectList({ payload = {} }, { call, put }) {
  const { currentPage = 1, pageSize = 10, sorter, search } = payload;
  const opts = {
    page: currentPage,
    rows: pageSize,
    sorter,
    search,
  };
  const doc = yield call(list.bind(wordfilter), opts);
  yield put({
    type: 'queryList',
    payload: {
      list: doc.rows,
      pagination: {
        total: doc.total,
        pageSize: opts.rows,
        current: doc.page,
      },
    },
  });
}

export default {
  namespace: 'wordfilter',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    list: effectList,
    *add({ payload = {} }, { call, put }) {
      yield call(create.bind(wordfilter), payload);
      yield* effectList({}, { call, put });
    },
    *remove({ payload, cb }, { call, put }) {
      yield call(remove.bind(wordfilter), payload);
      yield* effectList({}, { call, put });
      cb && cb();
    },
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
