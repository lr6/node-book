/**
 * Unix和类Unix（如Linux）：换行符采用 \n
 * Windows和MS-DOS：换行符采用 \r\n
 * Mac OS X之前的系统：换行符采用 \r
 * Mac OS X：换行符采用 \n
 * https://cloud.tencent.com/developer/article/1857433
 */

// import { platform } from 'os'
import readline from 'readline'

// 兼容Windows的写法
// let suffix = -1
// if(platform() === 'win32') {
//   suffix = -2
// }

function question(rl, { text, value }) {
  const q = `${text}(${value})\r\n`
  return new Promise((resolve) => {
    rl.question(q, (answer) => {
      resolve(answer || value)
    })
  })
}

export async function interact(questions) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  const answers = []
  for(let i = 0; i < questions.length; i++) {
    const q = questions[i]
    const answer = await question(rl, q)
    answers.push(answer)
  }
  rl.close()
  return answers
}
