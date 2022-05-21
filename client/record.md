```markdown
- 所有的不是因为修改业务，而修改源代码的行为，都是不好的。
- 在`jsx`文件中，就算是 函数组件 没有使用 `React` 代码 但也需要引入。
- `__fileName__` 是约定，和项目无关，只是辅助关系。

- 解决问题
  - 大部分问题都可以在 `谷歌 / github / stack-overflow` 上找到答案。
  - 关于业务问题，问 同事 还是比较快速解决的。
  - 最最后，实在不会了，再去问一些大佬。当然需要在你了解清楚问题之后，再去提问。
```

# `Record`

## 初始化

### **`File` 说明**

- `create-react-app` 初始化项目。

- `npx` 可以直接使用`npm`包， 而不需要安装包。

- `public` 文件是不参与打包的。 **`???`**

- `manifest.json` 是用来配置 `PWA` 的。

- `robots.txt` 是针对 搜索引擎爬虫的。

  > `Disallow: "/home"` 搜索引擎就不会访问 `Home` 页面。

- `yarn.lock` 锁定版本号。

- `react-app-env` - 引入一些预先定义好的 `Ts` 类型。

- `reportWebVitals` - 埋点上报

### `init`

> **使用 `create-react-app` 一步步地创建一个 `Ts` 项目，并引入 `antd`。**

- **`yarn create react-app xxx[name] --template typescript`**

- **解决运行报错**

  - `Cannot find type definition file for 'hoist-non-react-statics'`

    **解决： `yarn add @types/hoist-non-react-statics`**

  - `Cannot find type definition file for 'react-redux'`

    **解决： `yarn add @types/react-redux`**

- **`yarn add antd`**

- 修改 `src/App.tsx`，引入 `antd` 的按钮组件。

  ```tsx
  import React, { FC } from "react";
  import { Button } from "antd";
  import "./App.css";

  const App: FC = () => (
    <div className="App">
      <Button type="primary">Button</Button>
    </div>
  );

  export default App;
  ```

- 修改 `src/index.tsx`，引入 `antd.less`文件。

  ```tsx
  import "antd/dist/antd.less";
  ```

### 项目`Git`配置

```sh
git config user.email "Gxsnay@163.com"
git config user.name "Gxsnay"
```

### `tsconfig.json`

> **`tsconfig` 中配置 `baseUrl`，如果获取 绝对路径的话，就会去对应的 `baseUrl` 中寻找。**

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

### `Adv` - 主题配置

- **`yarn add @craco/craco`**

  ```json
  "scripts": {
  -   "start": "react-scripts start",
  -   "build": "react-scripts build",
  -   "test": "react-scripts test",
  +   "start": "craco start",
  +   "build": "craco build",
  +   "test": "craco test",
  +   "dev": "yarn start"
  }
  ```

- 在项目根目录创建一个 `craco.config.js` 用于修改默认配置。

  **`yarn add craco-less`**

  ```js
  const CracoLessPlugin = require("craco-less");

  module.exports = {
    plugins: [
      {
        plugin: CracoLessPlugin,
        options: {
          lessLoaderOptions: {
            lessOptions: {
              modifyVars: {
                "@primary-color": "#42b983",
                // '@primary-color': '#1DA57A',
                "@font-size-base": "16px",
              },
              javascriptEnabled: true,
            },
          },
        },
      },
    ],
  };
  ```

**此刻运行 `yarn dev`， 在页面上看到一个 绿色的按钮 说明 配置成功了。**

> - **删除对应的图片 以及 相关配置路径等。**
>
> - **配置 `json-server` 配置对应的文件以及内容**
>
>   **`yarn add json-server`**
>
>   ```json
>   // package.json配置
>   "json-server": "json-server __json_server_mock__/db.json --watch --port 3333 --middlewares ./__json_server_mock__/middleware.js"
>   ```

## 配置 `Git hooks & Git message lint`

### **添加 `prettier` 配置。**

- **`yarn add --dev --exact prettier `**

- **`touch .prettierrc.json - 格式化配置`**

- **`touch .prettierignore - 配置忽略规则的文件`**

  ```sh
  # .prettierignore
  build
  coverage
  ```

  ```sh
  # .prettierrc.json
  {}
  ```

### **`per-commit Hook`每次代码提交前 自动进行格式校验**

- **`npx mrm lint-staged` ｜ `npx mrm@2 lint-staged`**

  > 因为版本不兼容导致，需要使用 `nrm@2`

- **`yarn add lint-staged husky --dev`**

- **`yarn add eslint-config-prettier -D`**

  ```json
  // package.json
  // package.json 配置 eslint 添加 "prettier" 保证兼容配置
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest",
      "prettier"
    ]
  },
  "husky": { // 方便管理 git hook 的工具
    "hooks": {
      "pre-commit": "lint-staged", // per-commit 阶段 执行 lint-staged
        "commit-msg": "commitlint -E HUSKY_GIT_PARAMS" // 配置 commit message
    }
  },
  "lint-staged": {
    "*.{js,jsx,css,md,ts,tsx}": "prettier --write" // 配置包含文件
  }
  ```

### **配置 `commit message`**

[**参考此官网**](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional)

- **`yarn add @commitlint/{config-conventional,cli}`**

- **`yarn add @commitlint/cli @commitlint/config-conventional`**

- **`echo "module.exports = { extends: [\"@commitlint/config-conventional\"] };" > commitlint.config.js`**

  ```sh
  # .husky/commit-msg

  #!/bin/sh
  . "$(dirname "$0")/_/husky.sh"

  yarn commitlint --edit
  ```

  ```sh
  # .husky/pre-commit

  #!/bin/sh
  . "$(dirname "$0")/_/husky.sh"

  npx lint-staged
  ```

  > 其余`.husky`都是安装 插件的时候自带的。

  | **类型**        | **描述**                                                  |
  | --------------- | --------------------------------------------------------- |
  | **`feat`** - 🍓 | 新功能                                                    |
  | **`fix`** - 🍓  | 修补 bug                                                  |
  | **`chore`**     | 构建过程或辅助工具的变动                                  |
  | **`docs`**      | 文档相关                                                  |
  | **`style`**     | 格式（不影响代码运行的变动）                              |
  | `refactor`      | 重构                                                      |
  | `revert`        | 版本回退                                                  |
  | **`perf`** - 🍓 | 性能, 体验优化                                            |
  | `ci`            | 持续集成相关 `Travis，Jenkins，GitLab CI，Circle等的提交` |
  | `test`          | 新增/更新 测试                                            |
  | `build`         | 修改项目构建系统`gulp / webpack / vite / rollup`的提交    |

## 自定义`Hook`

## `Css in JS`

- **`styled-component`**

- **`emotion`**

  - **`yarn add @emotion/react @emotion/styled`**
  - **`vscode` 安装插件 `vscode-styled-components`**

  ```css
  /* 全局样式 App.css */
  html {
    /* 
      rem - 相对 根 元素的 font-size
      em - 相对 父 元素的 font-size
      1rem - 就相当于 1个 font-size 的单位。 - 10px;
      62.5% - 是因为 🍓🍓🍓 浏览器默认的像素是 16px； 16 * 62.5 = 10px;
    */
    font-size: 62.5%;
  }

  /*
    viewport height === vh 视口高度 
    1vh 是视口高度的 1%
  */
  html body #root .App {
    min-height: 100vh;
  }
  ```
