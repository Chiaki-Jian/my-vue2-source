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