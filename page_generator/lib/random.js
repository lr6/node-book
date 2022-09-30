/*
* 返回一个大于等于 min，小于 max 的随机整数
* 使用线性插值的方法
* */
export function randomInt(min, max) {
  const p = Math.random()
  // return Math.floor(min * (1 - p) + max * p)
  // 更好理解的版本
  return Math.floor(min + (max - min) * p)
}

/*
* 过程抽象的办法
* 用高阶函数的方式还有一个重要原因是，我们的语料库只需要在初始化时加载一次，而随机语料的获取操作要进行许多次。
* 那么我们直接用高阶函数在 createRandomPicked 的时候，通过函数闭包将语料库的数组绑定到返回的 randomPick 过程里，
* 就不用在每次随机获取的时候都传入数组参数了，使用上更方便
* */
export function createRandomPicked(arr) {
  // copy数组，避免修改原始数组
  arr = [...arr]
  function randomPicked() {
    const len = arr.length - 1
    const index = randomInt(0, len)
    const picked = arr[index];
    [arr[index], arr[len]] = [arr[len], arr[index]]
    return picked
  }
  // 抛弃第一次选择的结果
  randomPicked()
  return randomPicked
}

// 用高阶函数，只传入一次list即可，因为
// const list = [1, 2, 3, 4, 5, 6]
// const randomPickFunc = createRandomPicked(list)
// for(let i = 0; i < 10; i++) {
//   console.log(randomPickFunc());
// }
