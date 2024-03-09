// https://github.com/import-js/eslint-plugin-import/issues/2802
// eslint-disable-next-line import/no-unresolved
import Link from '@docusaurus/Link'
// eslint-disable-next-line import/no-unresolved
import Admonition from '@theme/Admonition'

const errorScopeMap = {
  user: {
    type: 'warning',
    title: '需要用户解决',
    children: (
      <p>
        这个错误需要你进行解决。<br></br>
        如果你遇到了任何问题，你都可以通过{' '}
        <Link to="/more/community">社区</Link> 途径寻求帮助。
      </p>
    ),
    badgeName: '需要用户解决',
    badgeClass: 'badge--warning',
  },

  dev: {
    type: 'warning',
    title: '需要开发者解决',
    children: (
      <p>
        这个错误需要你所使用软件的开发者进行解决。下面列举了解决方案。<br></br>
        如果你遇到了任何问题，你都可以通过{' '}
        <Link to="/more/community">社区</Link> 途径寻求帮助。
      </p>
    ),
    badgeName: '需要开发者解决',
    badgeClass: 'badge--warning',
  },

  chronocat: {
    type: 'warning',
    title: 'Chronocat 问题',
    children: (
      <p>
        这个问题为 Chronocat 的已知问题。下面列举了跟踪此问题的 Issue。<br></br>
        如果你遇到了任何问题，你都可以通过{' '}
        <Link to="/more/community">社区</Link> 途径寻求帮助。
      </p>
    ),
    badgeName: '需要开发者解决',
    badgeClass: 'badge--warning',
  },

  solved: {
    type: 'tip',
    title: '已由 Chronocat 解决',
    children: (
      <p>
        这个错误 Chronocat 已经解决，更新至最新的 Chronocat 版本即可。<br></br>
        如果你仍然遇到问题，则可以通过 <Link to="/more/community">
          社区
        </Link>{' '}
        途径寻求帮助。
      </p>
    ),
    badgeName: '已解决',
    badgeClass: 'badge--success',
  },
} as const

export type ErrorScopes = keyof typeof errorScopeMap

export const ErrorScope = ({ scope }: { scope: ErrorScopes }) => {
  const x = errorScopeMap[scope]

  return (
    <div>
      <Admonition type={x.type} title={x.title} children={x.children} />
    </div>
  )
}
