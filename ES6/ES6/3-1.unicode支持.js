const text = "𠮷"; //占用了两个码元（32位）

console.log("字符串长度：", text.length);
console.log("使用正则测试：", /^.$/u.test(text));
console.log("得到第一个码元：", text.charCodeAt(0));
console.log("得到第二个码元：", text.charCodeAt(1));

//𠮷：\ud842\udfb7
console.log("得到第一个码点：", text.codePointAt(0));
console.log("得到第二个码点：", text.codePointAt(1));