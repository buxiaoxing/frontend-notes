class Person {
  constructor(name, age){
    this.name = name
    this.age = age
  }
  sayHello(){
    console.log(`hello I'm ${this.name}`)
  }
  sayHello2 = ()=>{
    console.log(`hello I'm ${this.name} 2`)
  }
}