// @ts-check
import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
	devToolbar: { enabled: false },
	integrations: [
		starlight({
			title: 'wwlight',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/wwlight/wwlight.github.io' },
			],
			locales: {
				root: {
					label: '中文',
					lang: 'zh-CN'
				},
			},
			customCss: [
				'./src/styles/custom.css',
				'./src/styles/global.css',
			],
			sidebar: [
				{ slug: 'bookmarks', badge: 'TODO' },
				{ label: '备忘录', autogenerate: { directory: 'memorandum' } },
			]
		}),
	],
	site: 'https://wwlight.github.io',
	vite: {
		plugins: [tailwindcss()],
	},
})
