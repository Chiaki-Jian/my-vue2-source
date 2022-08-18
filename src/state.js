import { observe } from './observe'
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
  // console.log('data', data);
  // 将data挂在到vm实例上
  // debugger
  vm._data = data
  // 实现代理
  observe(data)
  // 将data内容代理到vm中，实现 vm.xxx = xxx
  for (const key in data) {
    proxy(vm, "_data", key)
  }
}

// 将数据代理到vm上
// vm.xx = xx
function proxy(vm, target, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[target][key]
    },
    set(newValue) {
      // debugger
      vm[target][key] = newValue
    }
  })

}