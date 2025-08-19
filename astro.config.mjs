import starlight from '@astrojs/starlight'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://wwlight.github.io',
  devToolbar: { enabled: false },
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
  },
  integrations: [
    starlight({
      title: 'wwlight',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/wwlight/wwlight.github.io' },
      ],
      locales: {
        root: {
          label: '中文',
          lang: 'zh-CN',
        },
      },
      customCss: [
        './src/styles/custom.css',
        './src/styles/global.css',
      ],
      sidebar: [
        { slug: 'bookmarks', badge: 'TODO' },
        { label: '备忘录', autogenerate: { directory: 'memorandum' } },
        { label: '工具集', autogenerate: { directory: 'tools' } },
      ],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
})
