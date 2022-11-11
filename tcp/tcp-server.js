const net = require('net')

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    socket.write(response('<h1>Hello world</h1>'))
    console.log(data)
  })

  socket.on('close', () => {
    console.log('close')
  })
}).on('error', (err) => {
  throw err
})

server.listen({
  host: '0.0.0.0',
  port: 6789
}, () => {
  console.log('opened server on', server.address())
})

function response(str) {
  return `HTTP/1.1 200 OK
Connection: keep-alive
Date: ${new Date()}
Content-length: ${str.length}
Content-Type: text/html

${str}`
}