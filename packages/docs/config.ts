import type { Options, ThemeConfig } from '@docusaurus/preset-classic'
import type { Config } from '@docusaurus/types'
import { join } from 'node:path'
import type { PresetOptions } from 'redocusaurus'

const title = 'Chronocat'
const tagline = '模块化的 Satori 框架'

const logo = {
  alt: 'Chronocat Logo',
  src: 'chronocat.svg',
  href: '/',
}

const presetConfig: Options = {
  docs: {
    routeBasePath: '/',
    sidebarPath: join(__dirname, 'sidebars.ts'),
    editUrl:
      'https://github.com/chrononeko/chronocat/tree/master/packages/docs',
  },

  blog: {
    postsPerPage: 'ALL',
    blogSidebarCount: 0,
  },

  theme: {
    customCss: join(__dirname, 'src/css/custom.scss'),
  },
}

const redocusaurusConfig: PresetOptions = {
  specs: [
    {
      id: 'openapi',
      spec: 'static/openapi.yaml',
      url: 'https://chronocat.vercel.app/openapi.yaml',
      route: '/develop/satori/reference/api',
      layout: {
        title: 'API 参考',
      },
    },
  ],
  theme: {
    primaryColor: '#2e8555',
    primaryColorDark: '#25c2a0',
  },
}

const themeConfig: ThemeConfig = {
  colorMode: {
    defaultMode: 'light',
    respectPrefersColorScheme: true,
  },

  image: 'chronocat.svg',

  metadata: [
    {
      name: 'description',
      content: tagline,
    },
    {
      name: 'keywords',
      content:
        'Chronocat, Crychiccat, Yukihana, Curinacat, Red, Chrononeko, RedProtocol, BetterQQNT, LiteLoaderQQNT, QQNTim, NoneBot, NoneBot2, Koishi, Koishi.js, Bot, Chatbot, 机器人, OneBot, QQ',
    },
  ],

  navbar: {
    title,

    logo,

    items: [
      {
        label: '使用',
        position: 'left',
        to: 'install',
      },
      {
        label: '开发',
        position: 'left',
        to: 'develop',
      },
      {
        label: '更多',
        position: 'left',
        type: 'dropdown',
        items: [
          {
            label: 'FAQ',
            to: 'faq/1',
          },
          {
            label: '错误码',
            to: 'code/all',
          },
          {
            label: '博客',
            to: 'blog',
          },
          {
            label: '更多内容',
            to: 'more',
          },
        ],
      },
      {
        label: 'v0.2',
        position: 'right',
        type: 'dropdown',
        items: [
          {
            label: 'v0.1',
            href: 'https://chronocat.vercel.app/v01',
          },
        ],
      },
      {
        href: 'https://github.com/chrononeko/chronocat',
        html: '<svg style="width:24px;height:24px;display:block" viewBox="0 0 24 24"><path fill="currentColor" d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" /></svg>',
        position: 'right',
      },
    ],
  },

  footer: {
    style: 'dark',

    logo: {
      ...logo,
      width: 80,
    },

    links: [
      {
        title: '使用',
        items: [
          {
            label: '安装',
            to: '/install',
          },
          {
            label: '接入',
            to: '/connect',
          },
          {
            label: '配置',
            to: '/config',
          },
        ],
      },
      {
        title: '开发',
        items: [
          {
            label: 'Satori',
            to: '/develop/satori',
          },
        ],
      },
      {
        title: '更多',
        items: [
          {
            label: 'FAQ',
            to: '/faq/1',
          },
          {
            label: '错误码',
            to: '/code/all',
          },
          {
            label: '博客',
            to: '/blog',
          },
          {
            label: '更多内容',
            to: '/more',
          },
          {
            label: '全站搜索',
            to: '/search',
          },
        ],
      },
    ],
    copyright: `<span>Copyright © ${new Date().getFullYear()} Team Chrononeko</span>`,
  },

  docs: {
    sidebar: {
      autoCollapseCategories: true,
    },
  },

  prism: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    theme: require('prism-react-renderer/themes/github'),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    darkTheme: require('prism-react-renderer/themes/palenight'),
  },

  announcementBar: {
    id: 'do_not_promote',
    content:
      '为了避免此前的事件再次发生，请勿在任何公众平台分享或宣传 Chronocat。',
    textColor: 'var(--ifm-heading-color)',
    backgroundColor: 'var(--ifm-background-color)',
    isCloseable: false,
  },
}

export const config: Config = {
  title,
  tagline,

  url: 'https://chronocat.vercel.app',
  baseUrl: '/',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  favicon: 'chronocat.ico',

  organizationName: 'chrononeko',
  projectName: 'chronocat',

  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  presets: [
    ['classic', presetConfig],
    ['redocusaurus', redocusaurusConfig],
  ],

  plugins: ['docusaurus-plugin-sass'],

  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['en', 'zh'],
        docsRouteBasePath: '/',
      },
    ],
  ],

  themeConfig,

  markdown: {
    mdx1Compat: {
      admonitions: false,
      comments: false,
      headingIds: false,
    },
  },
}
