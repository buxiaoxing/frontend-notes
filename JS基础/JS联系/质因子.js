// const rl = require("readline").createInterface({ input: process.stdin });
// var iter = rl[Symbol.asyncIterator]();
// const readline = async () => (await iter.next()).value;

// void async function () {
//     // Write your code here
//     while(line = await readline()){
//         let result = []
//         let i=2
//         while(i<=line){
//             if(line%i === 0){
//                 result.push(i)
//             }else{
//                 i++
//             }
//         }
//         console.log(result.join(" "))
//     }
// }()

function foo(line) {
  let result = []
  let i = 2
  let temp = line
  while (i <= temp && i*i<=temp) {
   while (line % i == 0){
      result.push(i)
      line /= i
    }
    i++
  }
  line != 1 && result.push(line)
  console.log(result.join(" "))
}
foo(180)