class Interceptor {

    constructor() {
        this.aspects = []
    }

    use(functor) {
        this.aspects.push(functor)
        return this
    }

    async run(context) {
        const aspects = this.aspects

        const proc = aspects.reduceRight(function (a, b) {
            return async () => {
                await b(context, a)
            }
        }, () => Promise.resolve())

        try {
            await proc()
        } catch (err) {
            console.log(err.message)
        }

        return context
    }
}

module.exports = Interceptor