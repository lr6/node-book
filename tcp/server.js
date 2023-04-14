
const Server = require('./http-interceptor.js')
const Router = require('./middleware.js')
const param = require('./param.js')
const fs = require('fs')

const router = new Router()
const app = new Server()


app.use(({ req }, next) => {
    console.log(`${req.method} ${req.url}`)
    next()
})

app.use(param)

app.use(router.get('/cov/index', async ({ route, res }, next) => {
    const { getCoronavirusKeyIndex } = require('./mock.js')
    const index = getCoronavirusKeyIndex()
    const handlebars = require('handlebars')

    const tpl = fs.readFileSync('./coronavirus_index.html', { encoding: 'utf-8' })
    const template = handlebars.compile(tpl)
    const result = template({ data: index })
    res.setHeader('Content-Type', 'text/html')
    res.body = result
    await next()
}))

app.use(router.get('/cov/:date', async ({ params, route, res }, next) => {
    const { getCoronavirusByDate } = require('./mock.js')
    const data = getCoronavirusByDate(route.date)

    if (params.type === 'json') {
        res.setHeader('Content-Type', 'application/json')
        res.body = { data }
    } else {
        const handlebars = require('handlebars')
        const tpl = fs.readFileSync('./coronavirus_date.html', { encoding: 'utf-8' })
        const template = handlebars.compile(tpl)
        const result = template({ data })
        res.setHeader('Content-Type', 'text/html')
        res.body = result
    }

    await next()
}))

app.use(router.all('/test/:course/:lecture', async ({ route, res }, next) => {
    res.setHeader('Content-Type', 'application/json')
    res.body = route
    await next()
}))

app.use(router.all('.*', async ({ req, res }, next) => {
    res.setHeader('Content-Type', 'text/html')
    res.body = '<h1>not found</h1>'
    res.statusCode = 404
    await next()
}))

app.listen({
    port: '9090',
    host: '0.0.0.0'
})
