// console.log(c)
// function c(){
//   console.log(c)
// }
// c = 1
// console.log(c)



(function () {
  console.log(typeof foo); // function
  console.log(typeof bar); // undefined
  var foo = "Hello"; // foo 被重新赋值 变成了一个字符串
  var bar = function () {
      return "World";
  }

  function foo() {
      return "good";
  }
  console.log(foo, typeof foo); //Hello string
})()