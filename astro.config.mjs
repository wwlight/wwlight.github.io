import { fileURLToPath } from 'node:url'
import db from '@astrojs/db'
import { unified } from '@astrojs/markdown-remark'
import react from '@astrojs/react'
import starlight from '@astrojs/starlight'
import inspectUrls from '@jsdevtools/rehype-url-inspector'
import tailwindcss from '@tailwindcss/vite'
import mermaid from 'astro-mermaid'
import { defineConfig } from 'astro/config'
import { bookmarksAdmin } from './integrations/bookmarks-admin.ts'
import { mermaidControls } from './integrations/mermaid-controls.ts'
import themeInitScript from './src/theme/scripts/init.inline.js?raw'

export default defineConfig({
  site: 'https://wwlight.github.io',
  devToolbar: { enabled: false },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  redirects: {
    '/bookmarks': '/bookmarks/nav/',
  },
  markdown: {
    syntaxHighlight: {
      type: 'shiki',
      excludeLangs: ['mermaid', 'math'],
    },
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
    mermaid({ autoTheme: true, enableLog: false }),
    mermaidControls(),
    db(),
    react(),
    bookmarksAdmin(),
    starlight({
      title: 'wwlight',
      credits: false,
      head: [{ tag: 'script', content: themeInitScript }],
      components: {
        Header: './src/components/Header.astro',
        Footer: './src/components/Footer.astro',
        MobileMenuFooter: './src/components/MobileMenuFooter.astro',
        Hero: './src/components/starlight/Hero.astro',
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
      customCss: [
        './src/styles/custom.css',
        './src/styles/global.css',
        './src/styles/mermaid-controls.css',
      ],
      sidebar: [
        {
          label: '博客',
          items: [
            { label: '总览', link: '/blog/' },
            {
              label: '书签导航与管理端搭建',
              collapsed: true,
              items: [
                { autogenerate: { directory: 'blog/bookmarks', collapsed: true } },
              ],
            },
            {
              label: 'Astro 使用',
              collapsed: true,
              items: [
                { autogenerate: { directory: 'blog/astro', collapsed: true } },
              ],
            },
            {
              label: '主题系统',
              collapsed: true,
              items: [
                { autogenerate: { directory: 'blog/theme', collapsed: true } },
              ],
            },
            {
              label: 'AI 开发',
              collapsed: true,
              items: [
                { autogenerate: { directory: 'blog/ai', collapsed: true } },
              ],
            },
          ],
        },
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
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
      dedupe: ['react', 'react-dom'],
      tsconfigPaths: true,
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'mermaid'],
    },
  },
})
