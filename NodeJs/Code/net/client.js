const net = require('net')

const socket = net.createConnection({
  host: "www.buxiaoxing.com",
  port: 443,
}, ()=>{
  console.log("连接成功")
})

socket.on("data", chunk=>{
  console.log(chunk.toString("utf-8"))
})
socket.write(`GET / HTTP/1.1
Host: www.buxiaoxing.com
Content-Type: application/x-www-form-urlencoded
Content-Length: 27

loginId=sss&loginPwd=123456`)