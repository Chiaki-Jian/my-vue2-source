import { newArrayProto } from './array'
export function observe(data) {
  if (data.__ob__ instanceof Observer) {
    // 说明当前data已经被代理过，无需再次劫持
    return data.__ob__
  }
  // 进行数据劫持
  // debugger
  if (typeof data !== 'object' || data === null) return
  return new Observer(data)
}

class Observer {
  constructor(data) { // Object.defineProperty 只能劫持已存在的属性，因此Vue会单独提供一些api（$set, $delete）
    /**
     * 此处判断当前data是不是数组的原因有以下几点：
     * 如果使用walk方法遍历一遍数组，那么defineReactive会给数组中每一项都绑定响应式，
     * 绑定响应式时还需要考虑数组中元素是否也为对象数据类型，可能需要深度劫持，那么数组长度越大，性能越差；
     **/

    // data.__ob__ = this // __ob__ 即是为data增加的自定义属性，用来调用Observer上的方法；又是一种标识，代表着拥有__ob__的数据已经观察过
    Object.defineProperty(data, '__ob__', {
      value: this,
      enumerable: false
    })
    if (Array.isArray(data)) {
      // 处理七个变异方法
      data.__proto__ = newArrayProto
      this.ObserverArray(data)
    } else {
      this.walk(data)
    }
  }
  walk(data) {
    Object.keys(data).forEach(key => {
      defineReactive(data, key, data[key])
    })
  }
  // 监听数组
  ObserverArray(data) {
    data.forEach(item => observe(item))
  }
}

export function defineReactive(target, key, value) { // 闭包
  observe(value)
  // debugger
  Object.defineProperty(target, key, {
    get() {
      console.log('key', key);
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
