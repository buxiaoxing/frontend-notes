
/**
 * 2. 变量提升：怪异的数据访问
 */
if (Math.random() < 0.5) {
    var a = "abc";
    console.log(a);
}
else {
    console.log(a);
}

console.log(a);

/**
 * 变量提升：闭包问题
 */

var div = document.getElementById("divButtons")
for (var i = 1; i <= 10; i++) {
    var btn = document.createElement("button");
    btn.innerHTML = "按钮" + i;
    div.appendChild(btn);
    btn.onclick = function () {
        console.log(i); //输出11
    }
}
// 循环结束后，i：11

/**
 * 3. 全局变量挂载到全局对象：全局对象成员污染问题
 */
var abc = "123";
console.log(window.abc);