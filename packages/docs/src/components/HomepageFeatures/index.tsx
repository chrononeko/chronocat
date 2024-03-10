// https://github.com/import-js/eslint-plugin-import/issues/2802
// eslint-disable-next-line import/no-unresolved
import Link from '@docusaurus/Link'
// eslint-disable-next-line import/no-unresolved
import Heading from '@theme/Heading'
import styles from './styles.module.css'

type FeatureItem = {
  title: string
  description: string
  to: string
  isDevelop?: boolean
}

const FeatureList: FeatureItem[] = [
  {
    title: '安装',
    description:
      '如果你尚未安装 Chronocat，请从这里开始安装。Chronocat 可通过 LiteLoaderQQNT 安装。',
    to: '/guide/install/shell',
  },
  {
    title: '接入',
    description:
      '如果你已安装 Chronocat，请从这里开始将 Chronocat 接入你喜爱的应用或框架。Chronocat 支持多种应用和框架。',
    to: '/guide/connect',
  },
  {
    title: '开发',
    description: '如果你想基于 Chronocat 开发框架或适配器，请从这里开始。',
    to: '/develop',
    isDevelop: true,
  },
]

const Feature = ({ title, description, to, isDevelop }: FeatureItem) => (
  <div className={`col col--4 ${styles.feature}`}>
    <div className="text--center padding-horiz--md">
      <Heading as="h3">{title}</Heading>
      <p className={styles.description}>{description}</p>
      <Link
        className={`button button--secondary button--lg ${
          isDevelop ? 'button--develop' : 'button--normal'
        }`}
        to={to}
      >
        开始{title}
      </Link>
    </div>
  </div>
)

export const HomepageFeatures = () => (
  <section className={styles.features}>
    <div className="container">
      <div className="row">
        {FeatureList.map((props, idx) => (
          <Feature key={idx} {...props} />
        ))}
      </div>
    </div>
  </section>
)
