const url = require('url')
const path = require('path')

function check(rule, pathname) {
    const paraMatched = rule.match(/:[^/]+/g)
    // const ruleExp = new RegExp(`^${rule.replace(/:[^/]+/g, '([^/]+)')}$`);
    const ruleExp = new RegExp(`^${rule.replace(/\/:[^/]+/g, '\\/([^/]+)')}$`);

    const ruleMatched = pathname.match(ruleExp);

    if (ruleMatched) {
        const ret = {};
        if (paraMatched) {
            for (let i = 0; i < paraMatched.length; i++) {
                ret[paraMatched[i].slice(1)] = ruleMatched[i + 1];
            }
        }
        return ret;
    }
    return null;
}

function route(method, rule, aspect) {
    return async (ctx, next) => {
        const req = ctx.req
        if (!ctx.url) ctx.url = url.parse(`http://${req.headers.host}${req.url}`)
        const checked = check(rule, ctx.url.pathname); // 根据路径规则解析路径
        if (!ctx.route && (method === '*' || req.method === method)
            && !!checked) {
            ctx.route = checked
            await aspect(ctx, next)
        } else { // 如果路径与路由规则不匹配，则跳过当前拦截切面，执行下一个拦截切面
            await next()
        }
    }
}

class Router {
    constructor(base = '') {
        this.baseURL = base;
    }

    get(rule, aspect) {
        return route('GET', rule.split(path.sep).join("/"), aspect)
    }

    post(rule, aspect) {
        return route('POST', rule.split(path.sep).join("/"), aspect)
    }

    put(rule, aspect) {
        return route('PUT', rule.split(path.sep).join("/"), aspect)
    }

    delete(rule, aspect) {
        return route('DELETE', rule.split(path.sep).join("/"), aspect)
    }

    all(rule, aspect) {
        return route('*', rule.split(path.sep).join("/"), aspect)
    }
}

module.exports = Router

