const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

class Loader {
  private dir: string;
  routes: any[];

  constructor() {
    this.dir = path.join(__dirname, '../src/pages');
    this.routes = [];
    this.load();
    this.routes = this.routes.sort((a, b) => a.order - b.order); // 排序
  }

  load() {
    const { dir } = this;
    fs.readdirSync(dir)
      .filter(
        (file: { indexOf: (arg0: string) => number }) =>
          fs.statSync(path.join(dir, file)).isDirectory() && file.indexOf('.') !== 0,
      )
      .forEach((doc: any) => {
        this.loadApp(doc);
      });

    // this.mergeLocales();
  }

  // 加载 app, 合并 routes
  loadApp(filePath: any) {
    const { dir } = this;
    const file = path.join(dir, filePath, '/routes.json');
    if (!fs.existsSync(file)) return;
    this.routes.push(...fse.readJsonSync(file));
    this.loadLocales(filePath);
    this.copyMocks(filePath);
  }

  // 生成 locales/*.ts
  loadLocales(filePath: any) {
    const { dir } = this;
    const localePath = path.join(dir, filePath, '/locales');
    if (!fs.existsSync(localePath)) return;
    fs.readdirSync(localePath)
      .filter(
        (doc: { indexOf: (arg0: string) => number }) =>
          fs.statSync(path.join(localePath, doc)).isFile() && doc.indexOf('.json') !== -1,
      )
      .forEach((doc: any) => {
        const key = path.basename(doc, '.json');
        const value = fse.readJsonSync(path.join(localePath, doc));
        const file = path.join(localePath, `${key}.ts`);
        const s = JSON.stringify(value, null, 2);
        fse.outputFileSync(file, `export default ${s};`);
      });
  }

  // 复制 mock
  copyMocks(filePath: any) {
    const { dir } = this;
    const mockPath = path.join(dir, filePath, '/mock');
    if (!fs.existsSync(mockPath)) return;
    fse.copySync(mockPath, path.join(__dirname, '../mock'));
  }
}

const loader = new Loader();

export default loader.routes;
