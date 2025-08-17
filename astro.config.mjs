// @ts-check
import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
	site: 'https://wwlight.github.io',
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
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
})
