import { options } from './lib/cmd.js'
import { loadCorpus, saveToFile } from "./lib/corpus.js"
import {generate} from "./lib/generator.js"
import { createRandomPicked } from "./lib/random.js"

const corpus = loadCorpus('corpus/data.json')
const title = options.title || createRandomPicked(corpus.title)()
const article = generate(title, {corpus})
const output = saveToFile(title, article)
console.log(`生成成功！文章保存于:${output}`)
