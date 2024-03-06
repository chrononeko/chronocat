// https://github.com/import-js/eslint-plugin-import/issues/2802
// eslint-disable-next-line import/no-unresolved
import Link from '@docusaurus/Link'
// eslint-disable-next-line import/no-unresolved
import Admonition from '@theme/Admonition'

export const Unsafe = () => (
  <div>
    <Admonition type="danger" title="不安全">
      <p>
        下面的内容不安全，或仍处在实验性功能阶段。使用下面的内容可能会造成无法预知的后果，如封号或丢失数据。
        <br></br>
        如果你在使用了下面的内容后遇到问题，我们可能无法帮助你。
        <br></br>
        如果你遇到了任何问题，你都可以通过{' '}
        <Link to="/more/community">社区</Link> 途径寻求帮助。
      </p>
    </Admonition>
  </div>
)
