
const Server = require('./http-interceptor.js')
const Router = require('./middleware.js')

const router = new Router()
const app = new Server()

app.use(router.all('/test/:course/:lecture', async ({ route, res }, next) => {
    res.setHeader('Content-Type', 'application/json')
    res.body = route
    await next()
}))

app.use(router.all('.*', async ({ req, res }, next) => {
    res.setHeader('Content-Type', 'text/html')
    res.body = '<h1>Hello world</h1>'
    await next()
}))

app.listen({
    port: '9090',
    host: '0.0.0.0'
})
