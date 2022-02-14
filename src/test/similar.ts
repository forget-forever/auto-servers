/*
 * @Author: zml
 * @Date: 2022-01-12 16:08:35
 * @LastEditTime: 2022-02-11 16:28:10
 */
const { similarSubstring } = require('similar-substring')

const run = () => {
  console.log(similarSubstring('aaabcfdstfnjet', 'bcf'))
}

module.exports = run