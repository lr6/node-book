import { options } from './lib/cmd.js'
import { loadCorpus, saveToFile } from "./lib/corpus.js"
import {generate} from "./lib/generator.js"
import { createRandomPicked } from "./lib/random.js"
import { interact } from "./lib/interact.js"
const corpus = loadCorpus('corpus/data.json')
let title = options.title || createRandomPicked(corpus.title)();

(async () => {
  if(Object.keys(options).length <= 0) {
    const answer = await interact([
      { text: '请输入文章的标题', value: title },
      { text: '请输入文章的最小字数', value: 6000 },
      { text: '请输入文章的最大字数', value: 10000 }
    ])
    title = answer[0]
    options.min = answer[1]
    options.max = answer[2]
  }
  const article = generate(title, {corpus})
  const output = saveToFile(title, article)
  console.log(`生成成功！文章保存于:${output}`)
})()
