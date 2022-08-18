// 为Vue提供初始化方法
// Vue 使用OptionApi, options配置符合Vue提供的规范：data，props，life Circle Hooks...
import { initState } from "./state"
import { compileToFunction } from './compiler'

export function initMixin(Vue) {
  // 为Vue原型增加初始化方法
  Vue.prototype._init = function (options) {
    const vm = this
    // 获取用户配置
    // 实现 vm.$options
    vm.$options = options
    // 初始化状态
    initState(vm)
    // 渲染dom
    if (options.el) {
      vm.$mount(options.el)
    }
  }
  // 为Vue原型增加dom挂载方法
  Vue.prototype.$mount = function (el) {
    const vm = this
    el = document.querySelector(el)
    const opts = vm.$options
    // 挂载节点的查询顺序： render => template => el(outerHTML)
    if (!opts.render) { // 如果render不存在，找options中是否有template选项
      let template
      if (!opts.template && el) {
        template = el.outerHTML // outerHTML是el包含el的最外层的dom元素
      } else {
        if (el) {
          template = opts.template
        }
      }
      if (template) {
        // todo 实现AST
        const render = compileToFunction(template)
        opts.render = render
      }
      // console.log('--$mount--/template:', template);
    } else {
    }
    opts.render
  }
}
