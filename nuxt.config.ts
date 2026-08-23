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
      collections: ['lucide', 'ph', 'tabler']
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
