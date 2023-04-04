const net = require('net')

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const matched = data.toString('utf-8').match(/^GET ([/\w]+) HTTP/)
    if (matched) {
      const path = matched[1]
      if (path === '/') {
        socket.write(response('<h1>Hello world</h1>'))
      } else {
        socket.write(response('<h1>Not Found</h1>'), 404, "NOT FOUND")
      }
    }
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

function response(str, status = 200, desc = 'OK') {
  return `HTTP/1.1 ${status} ${desc}
Connection: keep-alive
Date: ${new Date()}
Content-length: ${str.length}
Content-Type: text/html

${str}`
}