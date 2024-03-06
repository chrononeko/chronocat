// https://github.com/import-js/eslint-plugin-import/issues/2802
// eslint-disable-next-line import/no-unresolved
import Link from '@docusaurus/Link'
// eslint-disable-next-line import/no-unresolved
import Admonition from '@theme/Admonition'

export const UntrustedContents = () => (
  <div>
    <Admonition type="warning" title="社区内容">
      <p>
        下面的一些内容不由 Chrononeko
        团队管理，你应当前往对应项目以获得最新、最详细的教程。<br></br>
        如果你遇到了任何问题，你都可以通过{' '}
        <Link to="/more/community">社区</Link> 途径寻求帮助。
      </p>
    </Admonition>
  </div>
)
