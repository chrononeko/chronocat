import type { FC } from 'react'

export const HOS: FC = () => (
  <section>
    <div className="container">
      <h2>2024-04-06</h2>
      <p>我们发现 B 站有人在售卖低版本的 Chronocat 服务。</p>
      <img
        src="/hos/20240406.png"
        style={{
          maxWidth: 'min(100%, 600px)',
        }}
      />
      <p>
        Chronocat 是开源、免费的自由软件，你始终都可以在本站获取到 Chronocat
        的最新版本。使用低版本的 Chronocat 将会导致你的 QQ 冻结或封号。
      </p>
      <p>下面是售卖者的相关链接，请不要在这些地方购买此类服务。</p>
      <ul>
        <li>QQ 群：669657348</li>
        <li>
          <a href="https://www.bilibili.com/video/BV1Lj421R7Da" target="_blank">
            https://www.bilibili.com/video/BV1Lj421R7Da
          </a>
          （已被删除）
        </li>
        <li>
          <a href="https://afdian.net/a/chb2024" target="_blank">
            https://afdian.net/a/chb2024
          </a>
        </li>
        <li>
          <a href="https://api1.chenjianming.fun" target="_blank">
            https://api1.chenjianming.fun
          </a>
        </li>
        <li>
          <a href="http://cs.chenjianming.fun" target="_blank">
            http://cs.chenjianming.fun
          </a>
        </li>
      </ul>
    </div>
  </section>
)
