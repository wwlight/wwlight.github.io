/** Starlight 侧栏 / 顶栏模块导航：同 URL 点击不触发整页 reload */
;(function () {
  const NAV_LINK_SELECTOR = '#starlight__sidebar a, .module-nav a, .header-bookmarks-link'

  function normalizePath(pathname) {
    return pathname.endsWith('/') ? pathname : `${pathname}/`
  }

  function isSameDocumentNavigation(anchor) {
    if (anchor.target === '_blank' || anchor.hasAttribute('download'))
      return false

    let targetUrl
    try {
      targetUrl = new URL(anchor.href, location.href)
    }
    catch {
      return false
    }

    if (targetUrl.origin !== location.origin)
      return false
    if (normalizePath(targetUrl.pathname) !== normalizePath(location.pathname))
      return false
    if (targetUrl.search !== location.search)
      return false
    if (targetUrl.hash && targetUrl.hash !== location.hash)
      return false

    return true
  }

  document.addEventListener(
    'click',
    (event) => {
      if (!(event.target instanceof Element))
        return

      const anchor = event.target.closest('a')
      if (!anchor || !anchor.closest(NAV_LINK_SELECTOR))
        return
      if (!isSameDocumentNavigation(anchor))
        return

      event.preventDefault()
    },
    true,
  )
})()
