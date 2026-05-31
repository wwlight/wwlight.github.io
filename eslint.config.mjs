import antfu from '@antfu/eslint-config'

export default antfu({
  astro: true,
  ignores: ['src/scripts/theme-init.inline.js'],
  formatters: {
    css: true,
    html: true,
  },
  rules: {
    'node/prefer-global/process': 'off',
    'unicorn/prefer-global/process': 'off',
  },
})
