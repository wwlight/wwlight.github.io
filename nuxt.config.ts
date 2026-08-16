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
  studio: {
    repository: {
      provider: 'github',
      owner: 'wwlight',
      repo: 'docs',
      branch: 'main'
    }
  }
})
