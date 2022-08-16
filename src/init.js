// 为Vue提供初始化方法
// Vue 使用OptionApi, options配置符合Vue提供的规范：data，props，life Circle Hooks...
import { initState } from "./state"

export function initMixin(Vue) {
  // 为Vue原型增加初始化方法
  Vue.prototype._init = function (options) {
    const vm = this
    // 获取用户配置
    // 实现 vm.$options
    vm.$options = options
    // 初始化状态
    initState(vm)
    // todo...渲染dom
  }
}
