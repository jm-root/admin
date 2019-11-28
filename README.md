# admin

管理后台

基于 jm-ant-design-pro 。

## 与 jm-ant-design-pro 的文件差异

### 删除

```
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

### config/defaultSettings

```
+  title: 'Admin',
```

### src/components/GlobalHeader/RightContent.js

```
+ <Avatar menu/>
```

### src/public/favicon.png

### src/models/login.ts

### src/services/login.ts

### src/services/user.ts

### src/services/sdk

依赖 sdk

### src/pages/document.ejs

- title

### src/pages/User/Login.js

## 应用

- config

配置

- acl

权限
