const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

class Loader {
  constructor() {
    this.dir = path.join(__dirname, '../src/pages');
    this.locales = {};
    this.routes = [];
    this.load();
  }

  load() {
    const { dir } = this;
    fs.readdirSync(dir)
      .filter(file => fs.statSync(path.join(dir, file)).isDirectory() && file.indexOf('.') !== 0)
      .forEach(doc => {
        this.loadApp(doc);
      });

    this.mergeLocales();
  }

  // 加载 app, 合并 routes
  loadApp(filePath) {
    const { dir } = this;
    const file = path.join(dir, filePath, '/routes.json');
    if (!fs.existsSync(file)) return;
    this.routes.push(...fse.readJsonSync(file));
    this.loadLocales(filePath);
    this.copyMocks(filePath);
  }

  // 合并 locales
  loadLocales(filePath) {
    const { dir, locales } = this;
    const localePath = path.join(dir, filePath, '/locales');
    if (!fs.existsSync(localePath)) return;
    fs.readdirSync(localePath)
      .filter(
        doc => fs.statSync(path.join(localePath, doc)).isFile() && doc.indexOf('.json') !== -1
      )
      .forEach(doc => {
        const key = path.basename(doc, '.json');
        const value = fse.readJsonSync(path.join(localePath, doc));
        locales[key] = { ...locales[key], ...value };
      });
  }

  // 复制 mock
  copyMocks(filePath) {
    const { dir } = this;
    const mockPath = path.join(dir, filePath, '/mock');
    if (!fs.existsSync(mockPath)) return;
    fse.copySync(mockPath, path.join(__dirname, '../mock'));
  }

  // 合并来自 app 的locales，并更新 src/locales
  mergeLocales() {
    const { locales } = this;
    Object.keys(locales).forEach(key => {
      const value = locales[key];
      const file = path.join(__dirname, `../src/locales/${key}.js`);
      let s = fs.readFileSync(file);
      s = s.toString();
      s = s.replace('export default', 'module.exports = ');
      const tmpFile = `${file}.tmp`;
      fse.outputFileSync(tmpFile, s);
      /* eslint-disable */
      let o = require(tmpFile);
      o = { ...o, ...value };
      s = `export default ${JSON.stringify(o, null, 2)}`;
      fse.outputFileSync(file, s);
      fse.removeSync(tmpFile);
    });
  }
}

const loader = new Loader();

export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      ...loader.routes,
      // dashboard
      { path: '/', redirect: '/logLogin' },
    ],
  },
];
