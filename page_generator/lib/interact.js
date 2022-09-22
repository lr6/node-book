/**
 * Unix和类Unix（如Linux）：换行符采用 \n
 * Windows和MS-DOS：换行符采用 \r\n
 * Mac OS X之前的系统：换行符采用 \r
 * Mac OS X：换行符采用 \n
 * https://cloud.tencent.com/developer/article/1857433
 */

// const os = require('os')
// const platform = os.platform()


import { platform } from 'os'
let suffix = -1
if(platform() === 'win32') {
  suffix = -2
}

export function interact(questions) {
  process.stdin.setEncoding('utf-8')

  return new Promise((resolve) => {
    const answer = []
    let i = 0
    let { text, value } = questions[i++]
    console.log(`${text}（默认值：${value}）`)
    process.stdin.on('readable', () => {
      const read = process.stdin.read()
      let chunk = read.slice(0, suffix)
      answer.push(chunk || value)
      const nextQuestion = questions[i++]
      if(nextQuestion) {
        process.stdin.read()
        text = nextQuestion.text
        value = nextQuestion.value
        console.log(`${text}（默认值：${value}）`)
      } else {
        resolve(answer)
      }
    })
  })
}