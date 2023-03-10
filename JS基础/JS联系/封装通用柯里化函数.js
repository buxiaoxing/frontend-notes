
function curry(){
  var fn = arguments[0] // 获取要执行的函数
  var args = Array.prototype.slice(arguments, 1) // 获取传递的参数，从第二个参数(第一个是函数本身)
  if(args.length === fn.length){ // 传入参数数量等于函数所需参数数量
    return fn.apply(this, args)
  }
  // 参数不够向外界返回函数
  function _curry(){
    args.push(...arguments) // 将新接收到的参数推入参数数组中
    if(args.length === fn.length){
      return fn.apply(this, args)
    }
    return _curry // 参数不够，将函数返回出去
  }
  return _curry
}