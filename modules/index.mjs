import { con } from "./zhio.mjs"

const argv = process.argv
console.log(con(argv[2] || 'console.log'))
