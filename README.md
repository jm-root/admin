# admin

管理后台

基于 jm-ant-design-pro 。

## 与 jm-ant-design-pro 的文件差异

### 删除

```
.circleci/
functions/
scripts/
.firebaserc
CODE_OF_CONDUCT.md
firebase.json
README.ru-RU.md
README.zh-CN.md
src/pages/simple/

```

### README.md

本说明文件

### package.json

```
  "dependencies": {
+    "jm-ms": "^2.1.1",
+    "jm-sdk": "^2.1.4",

```
### config/config.js
proxy

### src/defaultSettings
```
+  title: 'Admin',
```
 
### src/components/SiderMenu/SiderMenu.js
title
### src/components/TopNavHeader/index.js
title
### src/layouts/BasicLayout
title
### src/layouts/Footer
links
### src/models/login.js

### src/services/user.js

### src/services/sdk

### src/services/api

依赖 sdk

## 应用

- config

配置
 
