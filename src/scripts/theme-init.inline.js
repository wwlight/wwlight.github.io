;(function () {
  function applyTheme() {
    const stored = localStorage.getItem('starlight-theme')
    const pref = stored || 'system'
    const theme
      = pref === 'system' || pref === 'auto'
        ? matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : pref === 'dark' || pref === 'light'
          ? pref
          : 'light'
    const root = document.documentElement
    root.dataset.theme = theme
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }

  applyTheme()
  // Starlight 的内联脚本会在本脚本之后覆盖 data-theme，延迟再同步一次。
  setTimeout(applyTheme, 0)
})()
