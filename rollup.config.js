// rollup 默认可以导出一个对象作为打包的配置文件

import babel from 'rollup-plugin-babel'

export default {
  input: './src/index.js', // 对标webpack -entry
  output: {
    file: './dist/vue.js',
    name: 'Vue',
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