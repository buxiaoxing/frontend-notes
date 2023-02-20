const prop1 = "name2";
const prop2 = "age2";
const prop3 = "sayHello2";

const user = {
    // 计算属性名
    [prop1]: "姬成",
    [prop2]: 100,
    [prop3](){ //方法省略冒号和关键字
        console.log(this[prop1], this[prop2])
    }
}

user[prop3]();

console.log(user)