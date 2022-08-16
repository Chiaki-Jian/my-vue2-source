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




## 2 初始化配置

按照Vue官方提供文档，使用Vue是需要创建Vue实例，实例中传入组件配置即可：

```js
// test/index.html

let vm = new Vue({
  data() {
    return {
      name: 'cheng',
      age: 16
    }
  }
})
```

Vue官方并没有使用class定义Vue类，而是使用构造函数实现Vue功能，减少了因为Class方案导致的内部方法过于冗杂和耦合的问题：

```js
// src/index.js

function Vue(options) {
  const vm = this // 避免主体混乱，使用变量vm接收Vue主体
  vm.$options = options
  // ...
}

export default Vue
```

如果按照上述代码继续实现Vue功能代码，仍会冗余。

切分核心方法init：

```js
//src/init.js
export initMixin(Vue) {
  Vue.prototype._init = function(options) {
     const vm = this
  	vm.$options = options
  // ...
		}
  }
}

```

```js
//src/index.js
import { initMixin } from './init'

function Vue(options) {
  this._init(options)
}

initMixin(Vue)

export default Vue

```

增加初始化==状态==的方法state

```js
// src/state.js
// 状态初始化方法
export function initState(vm) {
  const opts = vm.$options // 获取所有配置
  if (opts.data) {
    initData(vm)
  }
}

// 配置初始化方法 data
// 对数据设置代理
function initData(vm) {
  let data = vm.$options.data
  // data => 对象｜函数
  data = typeof data === 'function' ? data.call(vm) : data
  console.log('data', data);
}
```

