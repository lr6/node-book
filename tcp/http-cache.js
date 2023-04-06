const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs')
const mime = require('mime')

const server = http.createServer((req, res) => {

    let filePath = path.resolve(__dirname, path.join('www', url.fileURLToPath(`file://temp${req.url}`).replace('temp', '')))
    // let filePath = path.resolve(__dirname, path.join('www', url.parse(req.url).pathname))

    if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath)
        const isDir = stats.isDirectory()

        if (isDir) {
            filePath = path.join(filePath, 'index.html')
        }
        if (fs.existsSync(filePath)) {
            const { ext } = path.parse(filePath)
            const stats = fs.statSync(filePath)
            const timeStamp = req.headers['if-modified-since']
            let status = 200
            console.log(Number(timeStamp) === stats.mtimeMs)
            if (timeStamp && Number(timeStamp) === stats.mtimeMs) {
                status = 304
            }
            res.writeHead(status, {
                'Content-type': mime.getType(ext),
                'Cache-Control': 'max-age=86400',
                'Last-Modified': stats.mtimeMs
            })
            if (status === 200) {
                const stream = fs.createReadStream(filePath)
                stream.pipe(res)
            } else {
                res.end()
            }
        } else {
            res.writeHead(404, { 'Content-Type': 'text/html' })
            res.end('<h1>Not found</h1>')
        }
    }
})

server.on('clientError', (err, socket) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
})

server.listen(6789, () => {
    console.log('server open on', server.address())
})

