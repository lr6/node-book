const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs')
const mime = require('mime')

const server = http.createServer((req, res) => {
    console.log(req.url)

    let filePath = path.resolve(__dirname, path.join('www', url.fileURLToPath(`file://temp${req.url}`).replace('temp', '')))
    // let filePath = path.resolve(__dirname, path.join('www', url.parse(req.url).pathname))

    if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath)
        const isDir = stats.isDirectory()

        if (isDir) {
            filePath = path.join(filePath, 'index.html')
        }
        if (!isDir || fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath)
            const { ext } = path.parse(filePath)
            res.writeHead(200, { 'Content-type': mime.getType(ext) })
            // res.writeHead(200, { 'Content-type': 'text/html;charset=utf-8' })
            return res.end(content)
        }
    }

    res.writeHead(404, { 'Content-Type': 'text/html' })
    res.end('<h1>Not found</h1>')
})

server.on('clientError', (err, socket) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
})

server.listen(6789, () => {
    console.log('server open on', server.address())
})

