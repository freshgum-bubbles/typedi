/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('./src/app-config').AppConfigCustomFields} */
const customFields = {
  apiReference: {
    location: '/api-reference/',
    /**
     * Provide a pathname for easy use in Markdown files as a link.
     * The `pathname://` directive prevents Docusaurus from using its SPA's router
     * to interpret the link.
     * <https://docusaurus.io/docs/advanced/routing#escaping-from-spa-redirects>
    */
    link: 'pathname:///api-reference/'
  },
  github: {
    repoPath: 'freshgum-bubbles/typedi'
  }
};

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'TypeDI',
  tagline: 'Elegant Dependency Injection in JavaScript and TypeScript.',
  favicon: 'img/favicon.ico',

  staticDirectories: [
    // "static"
  ],

  "clientModules": [
    
  ],

  markdown: {
    mermaid: true
  },

  themes: [
    '@docusaurus/theme-mermaid',
    [
      // @ts-ignore
      require.resolve('@easyops-cn/docusaurus-search-local'),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions & Record<string, any>} */
      ({
        hashed: true,
        language: ['en']
      })
    ]
  ],

  // Set the production url of your site here
  url: 'https://your-docusaurus-test-site.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/typedi/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'freshgum-bubbles', // Usually your GitHub org/user name.
  projectName: 'typedi', // Usually your repo name.
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  customFields,

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          sidebarCollapsible: false,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/'
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      announcementBar: {
        // Not really sure what the ID does here, but guessing it's just for the DOM.
        id: 'global_announcement',

        // Add in a disclaimer about the documentation being alpha.
        content: 'This documentation is mostly complete, though lacking in some areas. Any incomplete sections are greyed out.',

        // We want to make sure people don't accidentally close it.
        isCloseable: false
      },

      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'TypeDI++',
        // logo: {
        //   alt: 'My Site Logo',
        //   src: 'img/logo.svg',
        // },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Tutorial'
          },
          {
            href: customFields.apiReference.link,
            label: 'API Reference',
            position: 'right'
          },
          {
            href: 'https://github.com/freshgum-bubbles/typedi',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/getting-started',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub',
                href: 'https:/github.com/freshgum-bubbles/typedi',
              }
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/facebook/docusaurus',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        /**
         * Implements magic comments in Markdown code blocks.
         * See: <https://docusaurus.io/docs/markdown-features/code-blocks#custom-magic-comments>
         */
        magicComments: [
          // Remember to extend the default highlight class name as well!
          {
            className: 'theme-code-block-highlighted-line',
            line: 'highlight-next-line',
            block: {start: 'highlight-start', end: 'highlight-end'},
          },
          {
            className: 'code-block-error-line',
            line: 'highlight-next-line-error',
          },
          {
            className: 'code-block-error-line-comment',
            line: 'highlight-error-comment',
            block: {start: 'highlight-error-comment-start', end: 'highlight-error-comment-end'}
          },
          {
            className: 'code-block-revision-line-comment',
            line: 'highlight-revision',
            block: {start: 'highlight-revision-start', end: 'highlight-revision-end'}
          }
        ],
      },
      colorMode: {
        defaultMode: 'dark',
        respectPrefersColorScheme: true
      },
      mermaid: {
        options: {
          fontSize: 17
        }
      }
    }),
};

module.exports = config;
