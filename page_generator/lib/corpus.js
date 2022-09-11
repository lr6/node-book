import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import moment from 'moment'

const __dirname = dirname(fileURLToPath(import.meta.url))

export function loadCorpus(src) {
  const path = resolve(__dirname, '..', src)
  const data = readFileSync(path, {encoding: 'utf-8'})

  return JSON.parse(data)
}

export function saveToFile(title, article) {
  const outPutDir = resolve(__dirname, '..', 'output')
  const time = moment().format('|YYYY-MM-DD|hh:mm:ss')
  const outPutFile = resolve(outPutDir, `${title}${time}.txt`)
  if(!existsSync(outPutDir)) {
    mkdirSync(outPutDir)
  }
  const text = `${title}\n\n    ${article.join('\n    ')}`
  writeFileSync(outPutFile, text)

  return outPutFile
}
