export function observe(data) {
  // 进行数据劫持
  // debugger
  if (typeof data !== 'object' || data === null) return
  return new Observer(data)
}

class Observer {
  constructor(data) {
    this.walk(data)
  }
  walk(data) {
    Object.keys(data).forEach(key => {
      defineReactive(data, key, data[key])
    })
  }
}

export function defineReactive(target, key, value) { // 闭包
  observe(value)

  // debugger
  Object.defineProperty(target, key, {
    get() {
      return value
    },
    set(newValue) {
      if (newValue === value) return
      console.log('--changed--', newValue);
      observe(newValue) // 若newValue是对象类型数据，递归实现对象代理
      return newValue
    }
  })
}
