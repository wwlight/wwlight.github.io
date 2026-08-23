/**
 * 明暗切换圆形揭示动画（移植自 wwlight.github.io/src/theme/lib/color-mode/color-mode.ts）
 * 使用 View Transitions API + clip-path，配合 app/app.css 的分层规则。
 */
const VT_DURATION = 400
const VT_EASING = 'ease-in-out'

/** 长页已滚动时固定 body，避免 root 快照只覆盖视口导致揭示动画错位 */
function lockDocumentScroll(): () => void {
  const scrollY = window.scrollY
  if (scrollY <= 0)
    return () => {}

  const { body } = document
  body.style.position = 'fixed'
  body.style.top = `-${scrollY}px`
  body.style.left = '0'
  body.style.right = '0'
  body.style.width = '100%'

  return () => {
    body.style.position = ''
    body.style.top = ''
    body.style.left = ''
    body.style.right = ''
    body.style.width = ''
    window.scrollTo(0, scrollY)
  }
}

function getSystemTheme(): 'dark' | 'light' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getResolvedTheme(): 'dark' | 'light' {
  const root = document.documentElement
  if (root.classList.contains('dark'))
    return 'dark'
  if (root.classList.contains('light'))
    return 'light'
  return getSystemTheme()
}

function applyTheme(theme: 'dark' | 'light') {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.classList.toggle('light', theme === 'light')
}

export function useThemeTransition() {
  const colorMode = useColorMode()

  async function setModeWithTransition(
    preference: 'dark' | 'light' | 'system',
    event: { clientX: number, clientY: number },
  ) {
    const next = preference === 'system' ? getSystemTheme() : preference

    const canTransition
      = 'startViewTransition' in document
        && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!canTransition || getResolvedTheme() === next) {
      colorMode.preference = preference
      return
    }

    const { clientX: x, clientY: y } = event
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    )

    const root = document.documentElement
    root.classList.add('theme-transitioning')
    const unlockScroll = lockDocumentScroll()

    let clipAnimation: Animation | null = null

    try {
      const transition = document.startViewTransition(() => {
        applyTheme(next)
        colorMode.preference = preference
      })
      await transition.ready

      const pseudo = next === 'dark'
        ? '::view-transition-old(root)'
        : '::view-transition-new(root)'

      const fromClip = next === 'dark'
        ? `circle(${endRadius}px at ${x}px ${y}px)`
        : `circle(0px at ${x}px ${y}px)`
      const toClip = next === 'dark'
        ? `circle(0px at ${x}px ${y}px)`
        : `circle(${endRadius}px at ${x}px ${y}px)`

      clipAnimation = document.documentElement.animate(
        { clipPath: [fromClip, toClip] },
        { duration: VT_DURATION, easing: VT_EASING, fill: 'both', pseudoElement: pseudo },
      )

      await transition.finished
    }
    catch {
      applyTheme(next)
      colorMode.preference = preference
    }
    finally {
      clipAnimation?.cancel()
      root.classList.remove('theme-transitioning')
      unlockScroll()
    }
  }

  return { setModeWithTransition }
}
