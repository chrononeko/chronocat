import { cyan, grey } from './colors'

const backgroundStrings = [
  'chronocat',
  'evolutionary',
  'bot',
  'satori',
  'engine',
  'safe',
  'lowcost',
  'consistency',
  'reliable',
  'convenient',
  'strong',
  'koishi',
  'ilharp',
]

const bgStr = (() => {
  const LENGTH = 200
  const arr = new Array(LENGTH).fill(0)
  return arr
    .map((_, __) => {
      const str =
        backgroundStrings[Math.floor(Math.random() * backgroundStrings.length)]
      return str
    })
    .join('.')
})()
let i = 0

export const STARTUP_TEXT = `
${`
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbb______bbbb__bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb______bbbbbbbbbbb__bbbbbb
bbbbbbb/ ____/bbb/ /_bbbb_____bb____bbbb____bbb____bbb/ ____/bb____b_bb/ /_bbbbb
bbbbbb/ /bbbbbbb/ __ \\bb/ ___/b/ __ \\bb/ __ \\b/ __ \\b/ /bbbbbb/ __ \`/b/ __/bbbbb
bbbbb/ /___bbbb/ /b/ /b/ /bbbb/ /_/ /b/ /b/ // /_/ // /___bbb/ /_/ /b/ /_bbbbbbb
bbbbb\\____/bbb/_/b/_/b/_/bbbbb\\____/b/_/b/_/b\\____/b\\____/bbb\\__,_/bb\\__/bbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
`
  .replace(/([^b])/g, cyan('$1'))
  .replace(/b/g, () => grey(bgStr[i++ % bgStr.length]!))}

`
