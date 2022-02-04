// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '月子喵的窝',
  tagline: '喵喵喵',
  url: 'https://haozi.moe',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'haozi23333', // Usually your GitHub org/user name.
  projectName: '月子喵の窝', // Usually your repo name.

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          blogSidebarCount: 0,
          routeBasePath: '/',
          archiveBasePath: '/archives',
          sortPosts: 'descending',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.less'),
        },
        googleAnalytics: {
          trackingID: 'UA-97900713-1'
        },
        sitemap: {
          changefreq: 'daily',
          priority: 0.5,
        },

      }),
    ],
  ],
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: '月子喵',
        logo: {
          alt: '月子喵本喵',
          src: '/logo/base.ico',
        },
        items: [
          {to: '/', label: '文章', position: 'left'},
          {to: '/tags', label: 'Tags', position: 'left'},
          {to: '/archives', label: '归档', position: 'left'},
          {
            type: 'dropdown',
            position: 'right',
            label: '小工具',
            to: '/tools',
            items: [
              {
                label: 'CityCode查询',
                to: '/tool/citycode',
              },
            ],
          },
          {to: '/links', label: '大佬们', position: 'right'},
          {
            type: 'localeDropdown',
            position: 'right',
          },

        ],
      },
      footer: {
        style: 'dark',
        links: [
        ],
        copyright: `Copyright © ${new Date().getFullYear()} 月月月子喵, Power By <a href="https://docusaurus.io/" target="_blank" rel="noopener noreferrer" >Docusaurus</a>.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
  plugins: [
    [
      '@docusaurus/plugin-ideal-image',
      {
        quality: 70,
        max: 1030, // max resized image's size.
        min: 640, // min resized image's size. if original is lower, use that size.
        steps: 2, // the max number of images generated between min and max (inclusive)
        disableInDev: false,
      },
    ],
    'docusaurus-plugin-sass',
    [
      "docusaurus-plugin-less",
      { lessOptions: { javascriptEnabled: true } }
    ]
  ]
};

module.exports = config;
