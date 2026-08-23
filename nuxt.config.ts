export default defineNuxtConfig({
  extends: [
    'docus'
  ],
  modules: [
    'nuxt-studio'
  ],
  ui: {
    fonts: false
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
        'simple-icons:apple',
        'simple-icons:nuxt'
      ]
    }
  },
  content: {
    build: {
      markdown: {
        highlight: {
          langs: ['sh', 'js', 'json', 'md']
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
