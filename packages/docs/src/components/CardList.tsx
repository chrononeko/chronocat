import type {
  PropSidebar,
  PropSidebarItem,
} from '@docusaurus/plugin-content-docs'
import { useDocsSidebar } from '@docusaurus/theme-common/internal'
// https://github.com/import-js/eslint-plugin-import/issues/2802
// eslint-disable-next-line import/no-unresolved
import DocCard from '@theme/DocCard'
import React from 'react'

export const CardList: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const { items } = useDocsSidebar() as unknown as {
    name: string
    items: PropSidebar
  }
  return (
    <section className="row">
      {items.slice(1).map((item: PropSidebarItem, index: number) => (
        <article key={index} className="col col--6 margin-bottom--lg">
          <DocCard item={item} />
        </article>
      ))}
    </section>
  )
}
