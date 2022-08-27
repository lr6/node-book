import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// 获取当前脚本的url
const url = import.meta.url
const path = resolve(dirname(fileURLToPath(url)), 'corpus/data.json')
const data = readFileSync(path, { encoding: 'utf-8' })
console.log(data)