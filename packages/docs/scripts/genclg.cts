import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const processRelease = (s: string) =>
  s.replace(
    /v\d+\.\d+\.\d+/,
    '[$&](https://github.com/chrononeko/chronocat/releases/tag/$&)',
  )

const componentMap = {
  core: 'https://github.com/chrononeko/chronocat/tree/master/packages/core',
  docs: 'https://github.com/chrononeko/chronocat/tree/master/packages/docs',
  iife: 'https://github.com/chrononeko/chronocat/tree/master/packages/iife',
  llqqnt: 'https://github.com/chrononeko/chronocat/tree/master/packages/llqqnt',
  qqntim: 'https://github.com/chrononeko/chronocat/tree/master/packages/qqntim',
  red: 'https://github.com/chrononeko/chronocat/tree/master/packages/red',
  'koishi-plugin-adapter':
    'https://github.com/chrononeko/chronocat-js/tree/master/packages/adapter',
  'koishi-plugin-assets-memory':
    'https://github.com/chrononeko/chronocat-js/tree/master/packages/assets-memory',
  'module-native': 'https://github.com/chrononeko/module-native/tree/master',
  miraigo: 'https://github.com/chrononeko/miraigo/tree/master',
  docker: 'https://github.com/chrononeko/docker/tree/master',
  cli: 'https://github.com/chrononeko/cli/tree/master',
} as const

type Component = keyof typeof componentMap

const processComponent = (c: Component) =>
  `### [${c}](${componentMap[c] || 'https://github.com/chrononeko/chronocat'})`

const processCommit = (c: Component, s: string) =>
  s.replace(
    /\(([a-z\d]{8})([a-z\d]{32})\)/g,
    `([\`$1\`](${
      /(https:\/\/github\.com\/chrononeko\/[\w-]*).*/.exec(
        componentMap[c],
      )?.[1] || 'https://github.com/chrononeko/chronocat'
    }/commit/$1$2))`,
  )

const processIssue = (s: string) =>
  s.replace(
    /\(#(\d+)\)/,
    '([#$1](https://github.com/chrononeko/bugtracker/issues/$1))',
  )

const processUser = (s: string) =>
  s.replace(/@([\w\-.]*)/, '[$&](https://github.com/$1)')

void (async () => {
  const lines = (await readFile(resolve(__dirname, '../../../CHANGELOG.md')))
    .toString()
    .split('\n')

  const result = ['---', 'title: 更新日志', 'sidebar_position: 10000', '---']

  let component: Component = 'core'

  for (let line of lines) {
    // # CHANGELOG
    if (line.startsWith('# ')) continue

    if (line.startsWith('## ')) {
      line = processRelease(line)
    } else if (line.startsWith('### ')) {
      component = line.slice(4) as Component
      line = processComponent(component)
    } else {
      line = processUser(processIssue(processCommit(component, line)))
    }

    result.push(line)
  }

  await writeFile(
    resolve(__dirname, '../docs/more/changelog.mdx'),
    result.join('\n'),
  )
})()
