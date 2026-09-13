export default defineNuxtConfig({
  extends: [
    'docus'
  ],
  modules: [
    'nuxt-studio',
    '@nuxt/fonts',
    './modules/font-subset'
  ],
  // 关掉远程/本地 provider，避免 Docus / Nuxt UI 再注入 Inter；正文字体由 font-subset 的 family.css 提供
  fonts: {
    providers: {
      google: false, bunny: false, fontsource: false, npm: false, local: false
    },
    families: []
  },
  ui: {
    fonts: false
  },
  experimental: {
    defaults: {
      nuxtLink: {
        prefetchOn: {
          interaction: false,
          visibility: false
        }
      }
    }
  },
  icon: {
    serverBundle: {
      collections: ['lucide', 'ph', 'tabler', 'simple-icons', 'vscode-icons']
    },
    clientBundle: {
      icons: [
        'lucide:notebook-text',
        'lucide:monitor',
        'lucide:sparkles',
        'lucide:code-xml',
        'lucide:terminal',
        'lucide:puzzle',
        'lucide:container',
        'lucide:git-branch',
        'lucide:square-terminal',
        'lucide:minimize-2',
        'lucide:scan-search',
        'lucide:scissors',
        'lucide:route',
        'lucide:server',
        'lucide:braces',
        'lucide:package',
        'lucide:toolbox',
        'lucide:arrow-right',
        'lucide:rocket',
        'lucide:book-open',
        'lucide:bookmark',
        'simple-icons:apple',
        'simple-icons:github',
        'simple-icons:nuxt',
        'vscode-icons:file-type-json',
        'vscode-icons:file-type-text'
      ]
    }
  },
  hooks: {
    close: () => process.exit(0)
  },
  content: {
    build: {
      markdown: {
        highlight: {
          langs: ['sh', 'js', 'json', 'jsonc', 'md']
        },
        rehypePlugins: {
          'rehype-external-links': {
            options: {
              target: '_blank',
              rel: ['noopener', 'noreferrer']
            }
          }
        }
      }
    }
  },
  mcp: {
    enabled: false,
  },
  studio: {
    route: '/admin',
    repository: {
      provider: 'github',
      owner: 'wwlight',
      repo: 'docs',
      branch: 'main'
    }
  }
})
