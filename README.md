# my-vue2-source

+ 实现vue2核心代码

## 1.项目构建

使用rollup打包工具创建项目

+ 初始化项目

  ```bash
  // 选中项目所在目录
  cd ./my-vue2-source
  // 使用npm管理项目
  npm init -y
  ```

+ 安装初始化依赖

  ```bash
  // 使用rollup打包js
  npm i rollup -D
  // 使用babel转译js
  npm i rollup-plugin-babel @babel/core @babel/preset-env
  ```

+  项目中使用babel将es6语法输出为浏览器识别的语法，使用babel预设置

  ```bash
  // 项目根目录下新建 .babelrc 配置文件
  touch .babelrc
  ```

  ```js
  // .babelrc
  {
    "presets": [
      "@babel/preset-env"
    ]
  }
  ```

+ 配置rollup规则

  ```bash
  // 项目根目录下新建 rollup.config.js 配置文件
  touch rollup.config.js
  ```

  ```js
  // rollup.config.js
  
  // rollup 默认可以导出一个对象作为打包的配置文件
  
  import babel from 'rollup-plugin-babel'
  
  export default {
    input: './src/index.js', // 对标webpack -entry
    output: {
      file: './dist/vue.js',
      name: 'Vue', // Tips: 打包输出配置中配置name属性为"Vue"，目的在于暴露一个全局变量Vue；
      format: 'umd', // esm es6; commonjs; iife; umd（支持 commonjs 和 amd）
      sourcemap: true // 支持调试代码
    },
    // 插件
    plugins: [
      babel({
        exclude: 'node_modules/**' // 排除打包
      })
    ]
  }
  ```

+ package.json配置脚本

  ```json
  {
    "devDependencies": {
      "@babel/core": "^7.18.10",
      "@babel/preset-env": "^7.18.10",
      "rollup": "^2.78.0",
      "rollup-plugin-babel": "^4.4.0"
    },
    + "scripts": {
    +  "dev": "rollup -cw"
    + }
  }
  ```

  
