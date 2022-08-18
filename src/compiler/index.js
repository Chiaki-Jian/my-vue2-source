// Regular Expressions for parsing tags and attributes
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
/**
 * 对标签tag进行正则匹配
 * 具有命名空间的tag：<namespace: div> </namespace:>
 * 自定义tag： <_div></_div>
 * 默认tag：<div></div>
*/
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
// 匹配开始标签 <xxx
const startTagOpen = new RegExp(`^<${qnameCapture}`)
// 匹配结束标签 </xxx>
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
// 匹配属性
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
// 匹配单标签结尾：<div> <br />
const startTagClose = /^\s*(\/?)>/
// 匹配mushtash {{ xxx }}
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

function parseHTML(html) {
  // 造树
  const ELEMENT_TYPE = 1
  const TEXT_TYPE = 3
  const stack = [] // 栈结构
  let currentParent // AST节点🈶元素当前父节点
  let root // 树根

  // 创建AST元素
  function createASTElement(tag, attrs) {
    return {
      tag,
      type: ELEMENT_TYPE,
      children: [],
      attrs,
      parent: null
    }
  }

  // 向前截取
  /**
   *  匹配 <div :
   *  <div :data="xxx" >{{ xxx }}</div>
   *    =>
   *  :data="xxx" >{{ xxx }}</div>
  */
  function advance(len) { // 向前截取
    html = html.substring(len)
  }
  // 分别获取 start、text、end
  function start(tag, attrs) {
    // console.log('start-tag', tag);
    // console.log('start-attrs', attrs);
    let node = createASTElement(tag, attrs)
    if (!root) { // 如果没有根结点，那就将当前节点当作跟节点
      root = node
    }
    // 如果当有父节点，那么给创建的AST元素增加parent属性，指向当前父节点
    if (currentParent) {
      node.parent = currentParent
      // currentParent.children.push(node)
    }
    // AST入栈
    stack.push(node)
    // 接下来匹配的都是当前AST元素节点的孩子，将当前父节点指向当生成的AST元素
    currentParent = node
  }

  // 所有匹配到的text，都作为当前父节点的children入栈
  function char(text) {
    text = text.replace(/\s/g, '')
    // console.log('char', text);
    text && currentParent.children.push(
      {
        type: TEXT_TYPE,
        text,
        parent: currentParent
      }
    )
  }
  // 弹出结束标签
  function end(tag) {
    // console.log('end', tag);
    let node = stack.pop()
    currentParent = stack[stack.length - 1]
  }

  // 解析开始标签内容
  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {
      // console.log('--parseHTML--/start:', start);
      // 生成匹配节点数据
      const match = {
        tagName: start[1],
        attrs: []
      }
      // 删除匹配到的标签字段
      advance(start[0].length)
      // console.log('--parseHTML--/match:', match);
      // console.log('--parseHTML--/匹配成功后的html:', html);
      // 匹配attribute
      // 如果不是匹配到startTagClose，则一直匹配到是为止
      let attr, end
      while (
        !(end = html.match(startTagClose)) // 没有匹配到 ">" 或者 "/>"
        && (attr = html.match(attribute))
      ) {
        advance(attr[0].length)
        match['attrs'].push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        })

        if (end) {
          advance(attr[0].length)
        }
        return match
      }
    }
    return false
  }
  // ！！！！准备转🌲 to line: 22

  while (html) {
    // console.log('--parseHTML--/匹配前的html:', html);
    let textEnd = html.indexOf('<')

    if (textEnd === 0) { // 0 意味着是标签
      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue;
      }
      // 如果不是开始标签 那就是结束标签
      let endTagMatch = html.match(endTag)
      if (endTagMatch) {
        end(endTagMatch.tagName)
        advance(endTagMatch[0].length)
        continue;
      }
    }
    if (textEnd > 0) {
      let text = html.substring(0, textEnd)
      if (text) {
        char(text)
        advance(text.length)
      }
    }
  }
  console.log(root);
}

export function compileToFunction(template) {
  // 对模板进行编译
  // 1、 将template转译成AST语法树
  let ast = parseHTML(template)
  // 2、 生成render方法，render方法执行后生成虚拟DOM
}