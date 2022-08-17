// 重写数组变异方法

const oldArrayProto = Array.prototype

export let newArrayProto = Object.create(oldArrayProto)

let arrayMethods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'sort',
  'reverse',
  'splice'
]

arrayMethods.forEach(method => {
  // 仅仅只对Array原型上的方法提供了替换方案，并没有对新增方法执行后新加的内容增加响应式
  newArrayProto[method] = function (...args) {
    // todo 对某一个变异的数组方法执行后新增的内容进行增加响应式
    let inserted // type: array
    const ob = this.__ob__ // data上增加的自定义属性，__ob__ => Observer

    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break;
      case 'splice': // splice(0, 1, {xx: xx}) => {xx: xx} 才是替换的内容,截掉前两个
        inserted = args.slice(2)
      default:
        break;
    }
    if (inserted) {
      // 在this.__ob__ 上挂载有 ObserverArray 方法，实现对数组的绑定响应式
      ob.ObserverArray(inserted)
      console.log('inserted _arrayMethods:', inserted);
    }
    console.log('method -arrayMethods:', method);
    const result = oldArrayProto[method].call(this, ...args);
    return result
  }
})