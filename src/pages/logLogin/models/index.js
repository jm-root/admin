const list = [
  {
    account: 'jeff',
    name: '鱼哥',
    gender: '男',
    crtime: new Date('2018-09-02 14:48:16'),
    ip: '116.21.13.73',
    email: 'jeff@jamma.cn',
  },
  {
    account: 'yun',
    name: '小云',
    gender: '女',
    crtime: new Date('2018-10-14 11:36:54'),
    ip: '116.21.13.738',
    email: 'yun@jamma.cn',
  },
  {
    account: 'yun',
    name: '小云',
    gender: '女',
    crtime: new Date('2018-10-14 11:36:54'),
    ip: '116.21.13.73',
    email: 'yun@jamma.cn',
  },
  {
    account: 'root',
    name: '管理员',
    gender: '男',
    crtime: new Date('2018-10-14 11:36:54'),
    ip: '116.21.13.73',
    email: 'root@jamma.cn',
  },
  {
    account: 'jeff',
    name: '鱼哥',
    gender: '男',
    crtime: new Date('2018-10-14 12:11:12'),
    ip: '116.21.13.73',
    email: 'jeff@jamma.cn',
  },
  {
    account: 'jeff',
    name: '鱼哥',
    gender: '男',
    crtime: new Date('2018-10-14 13:42:22'),
    ip: '116.21.13.73',
    email: 'jeff@jamma.cn',
  },
  {
    account: 'root',
    name: '管理员',
    gender: '男',
    crtime: new Date('2018-10-14 16:19:42'),
    ip: '116.21.13.73',
    email: 'root@jamma.cn',
  },
  {
    account: 'root',
    name: '管理员',
    gender: '男',
    crtime: new Date('2018-10-15 17:19:55'),
    ip: '116.21.13.73',
    email: 'jeff@jamma.cn',
  },
  {
    account: 'cici',
    name: 'cici',
    gender: '女',
    crtime: new Date('2018-10-16 17:30:34'),
    ip: '116.21.13.73',
    email: 'cici@jamma.cn',
  },
  {
    account: 'qiang',
    name: '强子',
    gender: '男',
    crtime: new Date('2018-10-16 19:41:26'),
    ip: '116.21.13.73',
    email: 'qiang@jamma.cn',
  },
  {
    account: 'jeff',
    name: '鱼哥',
    gender: '男',
    crtime: new Date('2018-10-25 12:16:59'),
    ip: '116.21.13.73',
    email: 'jeff@jamma.cn',
  },
];

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
