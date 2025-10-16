import starlight from '@astrojs/starlight'
import inspectUrls from '@jsdevtools/rehype-url-inspector'
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
  },
  integrations: [
    starlight({
      title: 'wwlight',
      credits: true,
      components: {
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
      customCss: [
        './src/styles/custom.css',
        './src/styles/global.css',
      ],
      sidebar: [
        { slug: 'bookmarks' },
        { label: '备忘录', autogenerate: { directory: 'memorandum' } },
        { label: '工具集', autogenerate: { directory: 'tools' } },
        { label: '系统相关', autogenerate: { directory: 'system' } },
        { label: '其他', autogenerate: { directory: 'other' } },
      ],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
})
