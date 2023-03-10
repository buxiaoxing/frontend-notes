// 下面代码输出什么？
// 考察引用类型的传递
var foo = {
  n: 0, // 1
  k: {
    n: 0, // 1
  },
};
var bar = foo.k;
bar.n++;
bar = {
  n: 10,
};
bar = foo;
bar.n++;
bar = foo.n;
bar++;
console.log(foo.n, foo.k.n);