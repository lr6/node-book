const http = require('http')
const url = require('url')

const responseData = {
    id: 'zhangsan',
    name: '张三',
    registerDate: '2022-3-1'
}

function toHtml(data) {
    return `
        <ul>
            <li>账号：${data.id}</li>
            <li>昵称：${data.name}</li>
            <li>注册时间：${data.registerDate}</li>
        </ul>
    `
}

const server = http.createServer((req, res) => {
    const { pathname } = url.parse(req.url)
    if (pathname === '/') {
        const accept = req.headers.accept
        if (accept.indexOf('application/json') > -1 || req.method === 'POST') {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(responseData))
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
            res.end(toHtml(responseData))
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' })
        res.end('<h1>Not found</h1>')
    }
})

server.on('clientError', (err, socket) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
})

server.listen(6789, () => {
    console.log('server open on', server.address())
})