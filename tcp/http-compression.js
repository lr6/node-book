const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs')
const mime = require('mime')
const zlib = require('zlib')

const server = http.createServer((req, res) => {

    let filePath = path.resolve(__dirname, path.join('www', url.fileURLToPath(`file://temp${req.url}`).replace('temp', '')))

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
            const acceptEncoding = req.headers['accept-encoding']
            let encoding = ''
            let status = 200
            if (timeStamp && Number(timeStamp) === stats.mtimeMs) {
                status = 304
            }
            const mimeType = mime.getType(ext)
            const resHeader = {
                'Content-type': mimeType,
                'Cache-Control': 'max-age=86400',
                'Last-Modified': stats.mtimeMs,
            }
            const compress = acceptEncoding && /^(text|application)\//.test(mimeType)
            if (compress) {
                const compressList = acceptEncoding.split(/\s*, \s*/)

                if (compressList[0]) {
                    encoding = compressList[0]
                }
                resHeader['Content-Encoding'] = encoding
            }
            res.writeHead(status, resHeader)
            if (status === 200) {
                const stream = fs.createReadStream(filePath)
                if (compress && encoding) {
                    let comp = ''
                    if (encoding === 'gzip') {
                        comp = zlib.createGzip()
                    } else if (encoding === 'deflate') {
                        comp = zlib.createDeflate()
                    } else {
                        comp = zlib.createBrotliCompress()
                    }
                    stream.pipe(comp).pipe(res)
                } else {
                    stream.pipe(res)
                }
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

