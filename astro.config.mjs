import db from '@astrojs/db'
import { unified } from '@astrojs/markdown-remark'
import react from '@astrojs/react'
import starlight from '@astrojs/starlight'
import inspectUrls from '@jsdevtools/rehype-url-inspector'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import { bookmarksAdmin } from './integrations/bookmarks-admin.ts'
import themeInitScript from './src/scripts/theme-init.inline.js?raw'

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
    processor: unified({
      rehypePlugins: [
        [
          inspectUrls,
          {
            selectors: ['a[href]'],
            inspectEach(url) {
              if (url.node.properties.href?.startsWith('http')) {
                url.node.properties.target = '_blank'
                url.node.properties.rel = 'noopener noreferrer'
              }
            },
          },
        ],
      ],
    }),
  },
  integrations: [
    db(),
    react(),
    bookmarksAdmin(),
    starlight({
      title: 'wwlight',
      credits: true,
      head: [{ tag: 'script', content: themeInitScript }],
      components: {
        Header: './src/components/Header.astro',
        MobileMenuFooter: './src/components/MobileMenuFooter.astro',
        ThemeSelect: './src/components/ThemeSelect.astro',
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/wwlight/wwlight.github.io' },
      ],
      locales: {
        root: {
          label: '中文',
          lang: 'zh-CN',
        },
      },
      customCss: ['./src/styles/custom.css', './src/styles/global.css'],
      sidebar: [
        { label: '备忘录', items: [{ autogenerate: { directory: 'memorandum' } }] },
        { label: '工具集', items: [{ autogenerate: { directory: 'tools' } }] },
        { label: '系统相关', items: [{ autogenerate: { directory: 'system' } }] },
        { label: '其他', items: [{ autogenerate: { directory: 'other' } }] },
      ],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      dedupe: ['react', 'react-dom'],
      tsconfigPaths: true,
    },
    server: {
      strictPort: Boolean(process.env.BOOKMARKS_ADMIN_STRICT),
    },
  },
})
