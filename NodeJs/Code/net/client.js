const net = require('net')

const socket = net.createConnection({
  host: "www.baidu.com",
  port: 80,
}, ()=>{
  console.log("连接成功")
})

var receive = null;
/**
 * 提炼出响应字符串的消息头和消息体
 * @param {*} response
 */
function parseResponse(response) {
  const index = response.indexOf("\r\n\r\n");
  const head = response.substring(0, index);
  const body = response.substring(index + 2);
  const headParts = head.split("\r\n");
  const headerArray = headParts.slice(1).map(str => {
    return str.split(":").map(s => s.trim());
  });
  // 二维数组转为对象
  const header = headerArray.reduce((a, b) => {
    a[b[0]] = b[1];
    return a;
  }, {});
  return {
    header,
    body: body.trimStart()
  };
}

function isOver() {
  // 需要接收的消息体的总字节数
  const contentLength = +receive.header["Content-Length"];
  // 当前接收到的字节数
  const curReceivedLength = Buffer.from(receive.body, "utf-8").byteLength;
  console.log(contentLength, curReceivedLength);
  return curReceivedLength > contentLength;
}

socket.on("data", chunk => {
  const response = chunk.toString("utf-8");
  if (!receive) {
    //第一次
    receive = parseResponse(response);
    if (isOver()) {
      socket.end();
    }
    return;
  }
  receive.body += response;
  if (isOver()) {
    socket.end();
    return;
  }
});

// socket.on("data", chunk=>{
//   console.log(chunk.toString("utf-8"))
// })
socket.write(`GET / HTTP/1.1
Host: www.baidu.com
Connection: keep-alive

`)
// 按HTTP协议传输

// socket.write("hello") // 也可以直接传输，但一般web服务器不会响应。
