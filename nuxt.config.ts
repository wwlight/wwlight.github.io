export default defineNuxtConfig({
  extends: ['docus'],
  modules: ['nuxt-studio', './modules/font-subset'],
  ui: {
    fonts: false,
  },
  docus: {
    assistant: {
      enabled: false,
    },
  },
  devtools: {
    disableAuthorization: true,
  },
  experimental: {
    defaults: {
      nuxtLink: {
        prefetchOn: {
          interaction: false,
          visibility: false,
        },
      },
    },
  },
  icon: {
    serverBundle: {
      collections: ['lucide', 'ph', 'tabler', 'simple-icons', 'vscode-icons'],
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
        'lucide:library',
        'lucide:bookmark',
        'simple-icons:apple',
        'simple-icons:github',
        'simple-icons:nuxt',
        'vscode-icons:file-type-json',
        'vscode-icons:file-type-text',
        'vscode-icons:file-type-ini',
      ],
    },
  },
  hooks: {
    ready({ options }) {
      const site = options.site
      if (!site || typeof site.url !== 'string' || !options.appConfig.seo)
        return

      const hostname = URL.parse(site.url)?.hostname
      if (!hostname)
        return

      Object.assign(options.appConfig.seo, {
        titleTemplate: `%s - ${hostname}`,
        title: hostname,
      })
    },
    close: (nuxt) => {
      if (nuxt.options._prepare)
        return
      process.exit(0)
    },
  },
  content: {
    build: {
      markdown: {
        highlight: {
          langs: ['sh', 'js', 'json', 'jsonc', 'md', 'ini'],
        },
        rehypePlugins: {
          'rehype-external-links': {
            options: {
              target: '_blank',
              rel: ['noopener', 'noreferrer'],
            },
          },
        },
      },
    },
  },
  mcp: {
    enabled: false,
  },
  llms: {
    domain: 'https://wwlight.github.io',
  },
  studio: {
    route: '/admin',
    repository: {
      provider: 'github',
      owner: 'wwlight',
      repo: 'wwlight.github.io',
      branch: 'main',
    },
  },
})
