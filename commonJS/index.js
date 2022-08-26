const zhio = require('./zhio')

const argv = process.argv
console.log(zhio(argv[2] || 'console.log'))