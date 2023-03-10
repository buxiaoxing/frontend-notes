/**/
class Computer {
    // 构造器
    constructor(name, price) {
        this.name = name;
        this.price = price;
    }
    // 原型方法
    showSth() {
        console.log(`这是一台${this.name}电脑`);
    }
    // 静态方法
    static comStruct() {
        console.log("电脑由显示器，主机，键鼠组成");
    }
}
console.log(Object.keys(new Computer()))



/* 转化为ES5 */
// "use strict";
// // 核对构造方法的调用形式
// function _classCallCheck(instance, Constructor) {
//     if (!(instance instanceof Constructor)) { // 如果instance 不是 Constructor 的实例，则报错。
//         throw new TypeError("Cannot call a class as a function");
//     }
// }

// function _defineProperties(target, props) {
//     for (var i = 0; i < props.length; i++) {
//         var descriptor = props[i];
//         descriptor.enumerable = descriptor.enumerable || false;
//         descriptor.configurable = true;
//         if ("value" in descriptor)
//             descriptor.writable = true;
//         Object.defineProperty(target, descriptor.key, descriptor);
//     }
// }

// function _createClass(Constructor, protoProps, staticProps) {
//     if (protoProps)
//         _defineProperties(Constructor.prototype, protoProps);
//     if (staticProps)
//         _defineProperties(Constructor, staticProps);
//     return Constructor;
// }

// var Computer = /*#__PURE__*/function () {
//     // 构造器
//     function Computer(name, price) {
//         _classCallCheck(this, Computer); // 如果是函数调用，this指向window

//         this.name = name;
//         this.price = price;
//     } // 原型方法


//     _createClass(Computer, [{
//         key: "showSth",
//         value: function showSth() {
//             console.log("\u8FD9\u662F\u4E00\u53F0".concat(this.name, "\u7535\u8111"));
//         } // 静态方法

//     }], [{
//         key: "comStruct",
//         value: function comStruct() {
//             console.log("电脑由显示器，主机，键鼠组成");
//         }
//     }]);

//     return Computer;
// }();
// var apple = new Computer("苹果", 15000);
// console.log(apple.name); // 苹果
// console.log(apple.price); // 15000
// apple.showSth(); // 这是一台苹果电脑
// Computer.comStruct(); // 电脑由显示器，主机，键鼠组成