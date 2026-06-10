var nav = require('./nav.js')
var { EcosystemNav, ComponentNav, BackendNav } = nav

var utils = require('./utils.js')
var { genNav, getComponentSidebar, deepClone } = utils

module.exports = {
  title: 'frontend-core',
  description: 'The new UI for ADempiere ERP',
  base: '/frontend-core/',
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: '/favicon.ico'
      }
    ]
  ],
  themeConfig: {
    repo: 'solop-develop/frontend-core',
    docsRepo: 'solop-develop/frontend-core',
    docsDir: 'docs',
    editLinks: true,
    sidebarDepth: 3,
    algolia: {
      apiKey: 'ffce0083d0830de5f562c045a481410b',
      indexName: 'vue_element_admin'
    },
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        editLinkText: 'Edit this page on GitHub',
        nav: [
          {
            text: 'ADempiere',
            link: '/adempiere/guide/'
          },
          {
            text: 'Framework',
            link: '/framework/'
          },
          {
            text: 'Features',
            items: genNav([...BackendNav, ...deepClone(ComponentNav)], 'EN')
          },
          {
            text: 'Ecosystem',
            items: genNav(deepClone(EcosystemNav), 'EN')
          },
          {
            text: 'Donate',
            link: '/donate/'
          },
          {
            text: '中文站点(gitee)',
            link: 'https://adempiere-vue.gitee.io/adempiere-vue/zh/'
          }
        ],
        sidebar: {
          '/adempiere/guide/': [
            '/adempiere/guide/',
            {
              title: 'Architecture',
              collapsable: true,
              children: [
                '/adempiere/guide/architecture/overview.md',
                '/adempiere/guide/architecture/component-tree.md',
                '/adempiere/guide/architecture/store.md',
                '/adempiere/guide/architecture/api-layer.md'
              ]
            },
            {
              title: 'Essentials',
              collapsable: true,
              children: ['/adempiere/guide/essentials/dev-setup.md']
            },
            {
              title: 'Components',
              collapsable: true,
              children: genComponentSidebar()
            },
            {
              title: 'Forms',
              collapsable: true,
              children: genFormsSidebar()
            },
            {
              title: 'Use Cases',
              collapsable: true,
              children: genUseCasesSidebar()
            },
            {
              title: 'Debugging',
              collapsable: true,
              children: [
                '/adempiere/guide/debugging/',
                '/adempiere/guide/debugging/browser-devtools.md',
                '/adempiere/guide/debugging/pos-debugging-cases.md',
                '/adempiere/guide/debugging/vuex-inspection.md'
              ]
            },
            {
              title: 'Other',
              collapsable: true,
              children: [
                '/adempiere/guide/other/discord.md',
                '/adempiere/guide/other/gitter.md',
                '/adempiere/guide/other/telegram.md',
                '/adempiere/guide/other/release-notes.md'
              ]
            }
          ],
          '/framework/': [
            '/framework/',
            '/framework/vuepress.md',
            {
              title: 'Essentials',
              collapsable: true,
              children: genEssentialsSidebar()
            },
            {
              title: 'Advanced',
              collapsable: true,
              children: genAdvancedSidebar()
            }
          ],
          '/framework/feature/component/': getComponentSidebar(
            deepClone(ComponentNav),
            'EN'
          ),
          '/framework/feature/script/': [
            '/framework/feature/script/svgo.md',
            '/framework/feature/script/new.md'
          ]
        }
      },
      '/es/': {
        label: 'Español',
        selectText: 'Idiomas',
        editLinkText: 'Editar esta página en GitHub',
        nav: [
          {
            text: 'ADempiere',
            link: '/es/adempiere/guide/'
          },
          {
            text: 'Framework',
            link: '/es/framework/'
          },
          {
            text: 'Características',
            items: genNav([...BackendNav, ...deepClone(ComponentNav)], 'ES')
          },
          {
            text: 'Ecosistema',
            items: genNav(deepClone(EcosystemNav), 'ES')
          },
          {
            text: 'Donar',
            link: '/es/donate/'
          }
        ],
        sidebar: {
          '/es/adempiere/guide/': [
            {
              title: 'Componentes',
              collapsable: true,
              children: genComponentSidebar('/es')
            },
            {
              title: 'Formularios',
              collapsable: true,
              children: genFormsSidebar('/es')
            },
            {
              title: 'Casos de Uso',
              collapsable: true,
              children: genUseCasesSidebar('/es')
            },
            {
              title: 'Otro',
              collapsable: true,
              children: [
                '/es/adempiere/guide/other/discord.md',
                '/es/adempiere/guide/other/gitter.md',
                '/es/adempiere/guide/other/telegram.md',
                '/es/adempiere/guide/other/release-notes.md'
              ]
            }
          ],
          '/es/framework/': [
            '/es/framework/',
            {
              title: 'Esenciales',
              collapsable: true,
              children: genEssentialsSidebar('/es')
            },
            {
              title: 'Avanzado',
              collapsable: true,
              children: genAdvancedSidebar('/es')
            }
          ],
          '/es/framework/feature/component/': getComponentSidebar(
            deepClone(ComponentNav),
            'ES'
          ),
          '/es/framework/feature/script/': [
            '/es/framework/feature/script/svgo.md',
            '/es/framework/feature/script/new.md'
          ]
        }
      },
      '/zh/': {
        label: '简体中文',
        selectText: '选择语言',
        editLinkText: '在 GitHub 上编辑此页',
        nav: [
          {
            text: 'ADempiere',
            link: '/zh/adempiere/guide/'
          },
          {
            text: 'Framework',
            link: '/zh/framework/'
          },
          {
            text: '功能',
            items: genNav([...BackendNav, ...deepClone(ComponentNav)], 'ZH')
          },
          {
            text: '生态系统',
            items: genNav(deepClone(EcosystemNav), 'ZH')
          },
          {
            text: '捐赠',
            link: '/zh/donate/'
          },
          {
            text: '中文站点(gitee)',
            link: 'https://adempiere-vue.gitee.io/adempiere-vue/zh/'
          },
          {
            text: '招聘',
            link: '/zh/job/'
          }
        ],
        sidebar: {
          '/zh/adempiere/guide/': [
            {
              title: '成分',
              collapsable: true,
              children: genComponentSidebar('/zh')
            },
            {
              title: '形式',
              collapsable: true,
              children: genFormsSidebar('/zh')
            },
            {
              title: 'Use Cases',
              collapsable: true,
              children: genUseCasesSidebar()
            },
            {
              title: '其它',
              collapsable: true,
              children: [
                '/zh/adempiere/guide/other/faq.md',
                '/zh/adempiere/guide/other/release-notes.md'
              ]
            }
          ],
          '/zh/framework/': [
            '/zh/framework/',
            {
              title: '組件',
              collapsable: true,
              children: genEssentialsSidebar('/zh')
            },
            {
              title: '进阶',
              collapsable: true,
              children: genAdvancedSidebar('/zh')
            }
          ],
          '/zh/framework/feature/component/': getComponentSidebar(
            deepClone(ComponentNav),
            'ZH'
          ),
          '/zh/framework/feature/script/': [
            '/zh/framework/feature/script/svgo.md',
            '/zh/framework/feature/script/new.md'
          ]
        }
      }
    }
  },
  locales: {
    '/': {
      lang: 'en-US',
      description: 'The new UI for ADempiere ERP'
    },
    '/zh/': {
      lang: 'zh-CN',
      description: 'The new UI for ADempiere ERP'
    },
    '/es/': {
      lang: 'es-ES',
      description:
        'La nueva UI para ADempiere ERP, tome su tiempo para ver estamaravillosa interfaz adaptada a los requerimientos de su negocio'
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@public': './public'
      }
    }
  },
  ga: 'UA-109340118-1'
}

function genEssentialsSidebar(type = '') {
  const mapArr = [
    '/framework/',
    '/framework/essentials/layout.md',
    '/framework/essentials/router-and-nav.md',
    '/framework/essentials/permission.md',
    '/framework/essentials/tags-view.md',
    '/framework/essentials/new-page.md',
    '/framework/essentials/style.md',
    '/framework/essentials/server.md',
    '/framework/essentials/mock-api.md',
    '/framework/essentials/import.md',
    '/framework/essentials/deploy.md',
    '/framework/essentials/env.md'
  ]
  return mapArr.map(i => {
    return type + i
  })
}

function genUseCasesSidebar(type = '') {
  const mapArr = [
    '/adempiere/guide/use-cases/process.md',
    '/adempiere/guide/use-cases/reports.md',
    '/adempiere/guide/use-cases/smartBrowser.md',
    '/adempiere/guide/use-cases/window.md',
    '/adempiere/guide/use-cases/searchTypeForms.md',
    '/adempiere/guide/use-cases/notes.md',
    '/adempiere/guide/use-cases/activity.md'
  ]
  return mapArr.map(i => {
    return type + i
  })
}

function genAdvancedSidebar(type = '') {
  const mapArr = [
    '/framework/advanced/cors.md',
    '/framework/advanced/eslint.md',
    '/framework/advanced/git-hook.md',
    '/framework/advanced/style-guide.md',
    '/framework/advanced/lazy-loading.md',
    '/framework/advanced/chart.md',
    '/framework/advanced/icon.md',
    '/framework/advanced/cdn.md',
    '/framework/advanced/theme.md',
    '/framework/advanced/i18n.md',
    '/framework/advanced/error.md',
    '/framework/advanced/webpack.md',
    '/framework/advanced/sass.md'
  ]
  return mapArr.map(i => {
    return type + i
  })
}

function genComponentSidebar(type = '') {
  const mapArr = [
    '/adempiere/guide/components/notes.md',
    '/adempiere/guide/components/activity.md',
    '/adempiere/guide/components/process.md',
    '/adempiere/guide/components/reports.md',
    '/adempiere/guide/components/smart-browser.md',
    '/adempiere/guide/components/guide.md',
    '/adempiere/guide/components/workflows-and-activities.md'
  ]
  return mapArr.map(i => {
    return type + i
  })
}

function genFormsSidebar(type = '') {
  const mapArr = [
    '/adempiere/guide/forms/point-of-sales.md',
    '/adempiere/guide/forms/check-price.md',
    '/adempiere/guide/forms/product-information.md'
  ]
  return mapArr.map(i => {
    return type + i
  })
}
