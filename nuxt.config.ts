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
    repository: {
      provider: 'github',
      owner: 'wwlight',
      repo: 'docs',
      branch: 'main'
    }
  }
})
