import antfu from '@antfu/eslint-config'

export default antfu({
  astro: true,
  formatters: {
    css: true,
    html: true,
    markdown: 'prettier',
  },
})
