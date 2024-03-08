import { bgBlue, cyan, grey, white } from "./colors"

declare const __DEFINE_CHRONO_VERSION__: string

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
  'ilharp'
]

const bgStr = (() => {
  const LENGTH = 200
  const arr = new Array(LENGTH).fill(0)
  return arr.map((_, __) => {
    const str = backgroundStrings[Math.floor(Math.random() * backgroundStrings.length)]
    return str
  }).join('.')
})()
let i = 0

export const STARTUP_TEXT = `
${`
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbb______bbbb__bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb______bbbbbbbbbbb__bbbbbb
bbbbbbb/b____/bbb/b/_bbbb_____bb____bbbb____bbb____bbb/b____/bb____b_bb/b/_bbbbb
bbbbbb/b/bbbbbbb/b__b\\bb/b___/b/b__b\\bb/b__b\\b/b__b\\b/b/bbbbbb/b__b\`/b/b__/bbbbb
bbbbb/b/___bbbb/b/b/b/b/b/bbbb/b/_/b/b/b/b/b//b/_/b//b/___bbb/b/_/b/b/b/_bbbbbbb
bbbbb\\____/bbb/_/b/_/b/_/bbbbb\\____/b/_/b/_/b\\____/b\\____/bbb\\__,_/bb\\__/bbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
`
    .replace(/([^b])/g, cyan('$1'))
    .replace(/b/g, () => grey(bgStr[(i++) % bgStr.length]!))
  }

${cyan('ChronoCat')} ${bgBlue(white(__DEFINE_CHRONO_VERSION__))}

${grey('[+] 点击形如 [CH2157] 的日志文本可以打开相应说明页面。')}

`

