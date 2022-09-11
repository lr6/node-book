import { createRandomPicked, randomInt } from "./random.js"

export function generate(title, { corpus, min = 6000, max = 10000 } = {}) {
  const articleLength = randomInt(min, max)
  const { famous, bosh_before, bosh, said, conclude } = corpus
  const [ pickFamous, pickBoshBefore, pickBosh, pickSaid, pickConclude ] = [ famous, bosh_before, bosh, said, conclude ].map(item => {
    return createRandomPicked(item)
  })
  const article = []
  let totalLength = 0
  while(totalLength < articleLength) {
    // 添加段落
    let section = ''
    const sectionLength = randomInt(200, 500)

    // 如果当前段落长度小于段落长度或者段落不是以句号。或者问号？结尾
    // while(section.length < sectionLength || !/[。？]$/.test(section)) {
    while(section.length < sectionLength) {
      const n = randomInt(0, 100)
      if(n < 20) {
        // 添加名人名言
        section += sentence(pickFamous, { said: pickSaid, conclude: pickConclude })
      } else if(n < 50) {
        // 添加带前置从句的废话
        section += sentence(pickBoshBefore, {title}) + sentence(pickBosh, {title})
      } else {
        // 添加不带前置从句的废话
        section += sentence(pickBosh, {title})
      }
    }
    totalLength += section.length
    article.push(section)
  }
  return article
}

function sentence(pick, replacer) {
  // 返回一个句子的文本
  let ret = pick()
  // replacer 是一个对象，存放替换占位符的规则
  for(const key in replacer) {
    // 如果replacer[key] 是一个pick函数，执行它随机取一条替换占位符，否则将它直接替换
    ret = ret.replace(new RegExp(`{{${key}}}`, 'g'),
      typeof replacer[key] === 'function' ? replacer[key]() : replacer[key])
  }
  return ret
}
