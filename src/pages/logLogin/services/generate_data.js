import moment from 'moment';

let iRandomMax = 200000000000; // 最大随机整数范围 0 <= randomValue <= iRandomMax;

/**
 * Class representing a random.
 */
class Random {
  /**
   * create a random
   * @param {Object} [opts] params
   */
  constructor(opts = {}) {
    this.seed = opts.seed || Date.now();
    this.randomMax = opts.randomMax || iRandomMax;
  }

  /**
   *
   * @return {number}
   */
  random() {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280.0;
  }

  /**
   * min<=result<=max
   * @param {number} min
   * @param {number} max
   * @return {number}
   */
  randomInt(min, max) {
    if (max === undefined) {
      max = min;
      min = 0;
    }
    let range = min + this.random() * (max - min + 1);
    return Math.floor(range);
  }

  /**
   * min<=result<=max
   * @param {number} min
   * @param {number} max
   * @return {number}
   */
  randomDouble(min, max) {
    if (max === undefined) {
      max = min;
      min = 0.0;
    }

    let range = min + this.random() * (max - min);
    return range;
  }

  /**
   *
   * @param {number} range
   * @return {number}
   */
  randomRange(range) {
    return this.randomInt(0, this.randomMax) % range;
  }

  /**
   *
   * @param {number} range
   * @param {number} odds
   * @return {number}
   */
  randomOdds(range, odds) {
    if (this.randomRange(range) < odds) return 1;
    return 0;
  }
}

const ips = [
  '116.21.13.73',
  '14.27.22.249',
  '116.21.13.738',
  '114.28.122.20',
  '65.52.108.142',
  '74.125.75.3',
  '74.125.64.81',
  '74.125.44.82',
  '74.125.158.86',
  '74.125.156.82',
  '65.52.108.146',
  '220.181.94.231',
  '220.181.94.229',
  '220.181.94.223',
  '220.181.125.71',
  '220.181.125.69',
  '220.181.125.45',
  '123.126.50.76',
  '123.126.50.70',
  '220.181.94.237',
  '220.181.94.235',
  '220.181.94.233',
  '220.181.94.225',
  '220.181.94.224',
  '220.181.94.213',
  '220.181.125.43',
  '220.181.125.162',
  '220.181.125.108',
  '202.85.214.159',
  '123.126.50.81',
  '123.126.50.78',
  '123.126.50.77',
  '123.126.50.75',
  '123.126.50.74',
  '123.126.50.72',
  '123.126.50.71',
  '123.126.50.69',
  '123.126.50.68',
  '123.126.50.66',
  '72.30.142.223',
  '67.195.37.168',
  '67.195.37.154',
  '202.160.180.198',
  '202.160.180.176',
  '202.160.180.118',
  '202.160.179.16',
  '202.160.179.127',
  '202.160.178.70',
  '110.75.176.30',
  '110.75.176.29',
  '110.75.176.28',
  '110.75.176.27',
  '110.75.176.26',
  '110.75.176.25',
  '110.75.173.176',
  '110.75.173.175',
  '110.75.173.174',
  '110.75.173.173',
  '110.75.173.172',
  '110.75.173.171',
  '74.6.18.249',
  '203.209.252.21',
  '202.160.189.241',
  '202.160.189.234',
  '202.160.188.215',
  '202.160.184.15',
  '202.160.182.11',
  '202.160.181.190',
  '202.160.180.8',
  '202.160.180.73',
  '202.160.180.66',
  '202.160.180.59',
  '202.160.180.53',
  '202.160.180.45',
  '202.160.180.39',
  '202.160.180.32',
  '202.160.180.27',
  '202.160.180.191',
  '202.160.180.187',
  '202.160.180.17',
  '202.160.180.165',
  '202.160.180.163',
  '202.160.180.16',
  '202.160.180.158',
  '202.160.180.155',
  '202.160.180.154',
  '202.160.180.148',
  '202.160.180.138',
  '202.160.180.136',
  '61.135.217.27',
  '61.135.249.9',
  '61.135.249.89',
];

const users = [
  {
    account: 'kay',
    name: '阿辉',
    gender: '男',
    email: 'kay@jamma.cn',
  },
  {
    account: 'yun',
    name: '小云',
    gender: '女',
    email: 'yun@jamma.cn',
  },
  {
    account: 'jeff',
    name: '鱼哥',
    gender: '男',
    email: 'jeff@jamma.cn',
  },
  {
    account: 'cici',
    name: 'cici',
    gender: '女',
    email: 'cici@jamma.cn',
  },
  {
    account: 'verson',
    name: '蔡坤',
    gender: '女',
    email: 'verson@jamma.cn',
  },
  {
    account: 'jasmin',
    name: '茉莉',
    gender: '女',
    email: 'jasmin@jamma.cn',
  },
  {
    account: 'qiang',
    name: '强子',
    gender: '男',
    email: 'qiang@jamma.cn',
  },
  {
    account: 'root',
    name: '管理员',
    gender: '男',
    email: 'root@jamma.cn',
  },
];

const data = [];

const random = new Random({ seed: 100 });
let t = moment('2018-08-02 10:40:36');
for (let i = 0; i < 205; i++) {
  const j = random.randomInt(ips.length - 1);
  const k = random.randomInt(users.length - 1);
  const o = Object.assign({}, users[k]);
  o.ip = ips[j];
  t = moment(t.valueOf() + random.randomInt(1000, 3600000));
  o.crtime = t;
  data.push(o);
}

export default data;
