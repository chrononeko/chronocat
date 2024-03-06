// https://github.com/import-js/eslint-plugin-import/issues/2802
// eslint-disable-next-line import/no-unresolved
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
// eslint-disable-next-line import/no-unresolved
import { HomepageFeatures } from '@site/src/components/HomepageFeatures'
// eslint-disable-next-line import/no-unresolved
import Heading from '@theme/Heading'
// eslint-disable-next-line import/no-unresolved
import Layout from '@theme/Layout'
import { clsx } from 'clsx'
import styles from './index.module.css'

const HomepageHeader = () => {
  const { siteConfig } = useDocusaurusContext()
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <img src="/chronocat.svg" width="200px" />
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
      </div>
    </header>
  )
}

// eslint-disable-next-line import/no-default-export
export default () => (
  <Layout>
    <HomepageHeader />
    <main>
      <HomepageFeatures />
    </main>
  </Layout>
)
