// randomInt 函数返回一个大于等于 min，小于 max 的随机整数
// 线性插值
export function randomInt(min, max) {
    const p = Math.random()
    return Math.floor(min * (1 - p) + max * p)
}

export function randomPick(arr) {
    const index = randomInt(0, arr.length)
    return arr[index]
}