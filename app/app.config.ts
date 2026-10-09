export default defineAppConfig({
  github: {
    url: 'https://github.com/wwlight/wwlight.github.io',
  },
  header: {
    title: 'wwlight',
  },
  navigation: {
    sub: 'header',
  },
  ui: {
    colors: {
      primary: 'green',
      neutral: 'slate',
    },
    prose: {
      codeIcon: {
        jsonc: 'i-vscode-icons-file-type-json',
        '.gitmodules': 'i-vscode-icons-file-type-ini',
      },
    },
  },
})
