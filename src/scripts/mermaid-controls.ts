import '../styles/mermaid-controls.css'

interface DiagramController {
  zoomIn: () => void
  zoomOut: () => void
  reset: () => void
  destroy: () => void
}

const controllerByPre = new WeakMap<HTMLElement, DiagramController>()
const MARK = 'data-mermaid-controls'

const ICONS = {
  'zoom-in': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  'zoom-out': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  reset: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  fullscreen: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  'exit-fullscreen': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
} as const

const MIN_SCALE = 0.2
const MAX_SCALE = 8
const ZOOM_FACTOR = 1.2

let controlsStarted = false
let themeRerenderQueued = false
let mermaidPromise: Promise<typeof import('mermaid').default> | null = null

function mermaidTheme() {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'default'
}

async function getMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({ startOnLoad: false, theme: mermaidTheme() })
      return mermaid
    })
  }
  return mermaidPromise
}

async function renderMermaid(force = false) {
  const diagrams = document.querySelectorAll<HTMLElement>('pre.mermaid')
  if (diagrams.length === 0) return

  const mermaid = await getMermaid()
  mermaid.initialize({ startOnLoad: false, theme: mermaidTheme() })

  for (const diagram of diagrams) {
    if (!force && diagram.hasAttribute('data-processed')) continue

    const definition = diagram.getAttribute('data-diagram') ?? diagram.textContent ?? ''
    if (!diagram.hasAttribute('data-diagram'))
      diagram.setAttribute('data-diagram', definition)

    const id = `mermaid-${Math.random().toString(36).slice(2, 11)}`
    try {
      const { svg } = await mermaid.render(id, definition)
      diagram.innerHTML = svg
      diagram.setAttribute('data-processed', 'true')
    }
    catch (error) {
      diagram.removeAttribute('data-processed')
      console.error('[mermaid]', error)
    }
  }

  scheduleSync(true)
}

async function rerenderForTheme() {
  const diagrams = document.querySelectorAll<HTMLElement>('pre.mermaid')
  if (diagrams.length === 0) return

  for (const pre of diagrams)
    destroyDiagram(pre)

  mermaidPromise = null
  await renderMermaid(true)
}

function queueThemeRerender() {
  if (!document.querySelector('pre.mermaid')) return
  if (themeRerenderQueued) return
  themeRerenderQueued = true
  requestAnimationFrame(() => {
    themeRerenderQueued = false
    void rerenderForTheme()
  })
}

function startPage() {
  void renderMermaid().then(() => bootstrap())
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function safeSetPointerCapture(target: HTMLElement, pointerId: number) {
  try {
    target.setPointerCapture(pointerId)
  }
  catch {
    // 部分浏览器在特定节点上会抛错，忽略即可
  }
}

function safeReleasePointerCapture(target: HTMLElement, pointerId: number) {
  try {
    if (target.hasPointerCapture(pointerId)) {
      target.releasePointerCapture(pointerId)
    }
  }
  catch {
    // ignore
  }
}

class MermaidDiagramController implements DiagramController {
  private scale = 1
  private panX = 0
  private panY = 0
  private pointerId: number | null = null
  private lastX = 0
  private lastY = 0

  constructor(private readonly target: HTMLElement) {
    this.target.addEventListener('wheel', this.onWheel, { passive: false })
    this.target.addEventListener('pointerdown', this.onPointerDown)
    this.target.addEventListener('pointermove', this.onPointerMove)
    this.target.addEventListener('pointerup', this.onPointerUp)
    this.target.addEventListener('pointercancel', this.onPointerUp)
    this.apply()
  }

  zoomIn() {
    this.scale = clamp(this.scale * ZOOM_FACTOR, MIN_SCALE, MAX_SCALE)
    this.apply()
  }

  zoomOut() {
    this.scale = clamp(this.scale / ZOOM_FACTOR, MIN_SCALE, MAX_SCALE)
    this.apply()
  }

  reset() {
    this.scale = 1
    this.panX = 0
    this.panY = 0
    this.apply()
  }

  destroy() {
    this.target.style.transform = ''
    this.target.removeEventListener('wheel', this.onWheel)
    this.target.removeEventListener('pointerdown', this.onPointerDown)
    this.target.removeEventListener('pointermove', this.onPointerMove)
    this.target.removeEventListener('pointerup', this.onPointerUp)
    this.target.removeEventListener('pointercancel', this.onPointerUp)
  }

  private apply() {
    this.target.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.scale})`
  }

  private readonly onWheel = (event: WheelEvent) => {
    event.preventDefault()
    const factor = event.deltaY > 0 ? 1 / ZOOM_FACTOR : ZOOM_FACTOR
    this.scale = clamp(this.scale * factor, MIN_SCALE, MAX_SCALE)
    this.apply()
  }

  private readonly onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return
    this.pointerId = event.pointerId
    this.lastX = event.clientX
    this.lastY = event.clientY
    safeSetPointerCapture(this.target, event.pointerId)
  }

  private readonly onPointerMove = (event: PointerEvent) => {
    if (this.pointerId !== event.pointerId) return
    this.panX += event.clientX - this.lastX
    this.panY += event.clientY - this.lastY
    this.lastX = event.clientX
    this.lastY = event.clientY
    this.apply()
  }

  private readonly onPointerUp = (event: PointerEvent) => {
    if (this.pointerId !== event.pointerId) return
    safeReleasePointerCapture(this.target, event.pointerId)
    this.pointerId = null
  }
}

function createToolbar(controller: DiagramController, shell: HTMLElement) {
  const toolbar = document.createElement('div')
  toolbar.className = 'mermaid-toolbar'
  toolbar.setAttribute('role', 'toolbar')
  toolbar.setAttribute('aria-label', '图表操作')

  const actions = [
    { action: 'zoom-in', label: '放大' },
    { action: 'zoom-out', label: '缩小' },
    { action: 'reset', label: '重置视图' },
    { action: 'fullscreen', label: '全屏' },
  ] as const

  for (const { action, label } of actions) {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'mermaid-toolbar-btn'
    button.dataset.action = action
    button.setAttribute('aria-label', label)
    button.innerHTML = ICONS[action]

    button.addEventListener('click', (event) => {
      event.preventDefault()
      event.stopPropagation()
      if (action === 'zoom-in') controller.zoomIn()
      else if (action === 'zoom-out') controller.zoomOut()
      else if (action === 'reset') controller.reset()
      else if (action === 'fullscreen') toggleFullscreen(shell)
    })

    toolbar.appendChild(button)
  }

  shell.prepend(toolbar)

  toolbar.addEventListener('pointerdown', (event) => {
    event.stopPropagation()
  })
}

function toggleFullscreen(shell: HTMLElement) {
  if (document.fullscreenElement === shell) {
    void document.exitFullscreen()
    return
  }
  void shell.requestFullscreen?.()
}

function updateFullscreenButton(shell: HTMLElement) {
  const button = shell.querySelector<HTMLButtonElement>('[data-action="fullscreen"]')
  if (!button) return

  const active = document.fullscreenElement === shell
  button.setAttribute('aria-label', active ? '退出全屏' : '全屏')
  button.innerHTML = active ? ICONS['exit-fullscreen'] : ICONS.fullscreen
  button.classList.toggle('is-active', active)
}

function isThemeRefresh(pre: HTMLElement) {
  // 主题刷新时 data-processed 会短暂消失，保护 shell 不被 destroy
  return pre.getAttribute(MARK) !== null && !pre.hasAttribute('data-processed')
}

function destroyDiagram(pre: HTMLElement) {
  controllerByPre.get(pre)?.destroy()
  controllerByPre.delete(pre)

  const shell = pre.closest('.mermaid-shell')
  if (shell?.parentElement) {
    shell.parentElement.insertBefore(pre, shell)
    shell.remove()
  }

  pre.removeAttribute(MARK)
}

function canEnhance(pre: HTMLElement) {
  return pre.matches('pre.mermaid')
    && pre.hasAttribute('data-processed')
    && Boolean(pre.querySelector('svg'))
    && pre.getAttribute(MARK) !== 'ready'
}

function enhanceDiagram(pre: HTMLElement) {
  if (!canEnhance(pre)) return
  if (pre.getAttribute(MARK) === 'pending') return

  pre.setAttribute(MARK, 'pending')

  const shell = document.createElement('div')
  shell.className = 'mermaid-shell notranslate'
  shell.setAttribute('translate', 'no')

  pre.parentElement?.insertBefore(shell, pre)
  shell.append(pre)

  pre.style.transformOrigin = 'center center'
  // 渲染前先移除可能导致高度不稳定的 min-height
  pre.style.minHeight = ''

  const controller = new MermaidDiagramController(pre)
  controllerByPre.set(pre, controller)
  createToolbar(controller, shell)
  pre.setAttribute(MARK, 'ready')

  // 首次渲染成功后，锁定 shell 的内容高度，避免主题切换时高度跳变导致布局抖动
  if (!shell.style.height) {
    const h = shell.offsetHeight
    if (h > 0) shell.style.height = `${h}px`
  }
}

function syncDiagrams() {
  for (const pre of document.querySelectorAll<HTMLElement>('pre.mermaid')) {
    if (canEnhance(pre)) {
      enhanceDiagram(pre)
      continue
    }

    if (pre.getAttribute(MARK) && !pre.hasAttribute('data-processed') && !isThemeRefresh(pre)) {
      destroyDiagram(pre)
    }
  }
}

let syncQueued = false
let themeRefreshTimer: ReturnType<typeof setTimeout> | undefined

function lockShellHeights() {
  for (const shell of document.querySelectorAll<HTMLElement>('.mermaid-shell')) {
    if (!shell.style.height) {
      const h = shell.offsetHeight
      if (h > 0) shell.style.height = `${h}px`
    }
    // 主题刷新期间，清除 pre 上的 min-height，避免骨架屏高度干扰
    const pre = shell.querySelector<HTMLElement>('pre.mermaid')
    if (pre) pre.style.minHeight = ''
  }
}

function scheduleSync(force = false) {
  if (!force) {
    const refreshing = [...document.querySelectorAll<HTMLElement>('pre.mermaid')].some(isThemeRefresh)
    if (refreshing) {
      lockShellHeights()
      clearTimeout(themeRefreshTimer)
      themeRefreshTimer = setTimeout(() => scheduleSync(true), 80)
      return
    }
  }

  if (syncQueued) return
  syncQueued = true
  requestAnimationFrame(() => {
    syncQueued = false
    syncDiagrams()
  })
}

function bootstrap() {
  scheduleSync()

  let attempts = 0
  const retry = () => {
    syncDiagrams()
    attempts += 1
    const pending = document.querySelectorAll(`pre.mermaid:not([${MARK}="ready"])`)
    if (attempts < 40 && pending.length > 0) {
      requestAnimationFrame(retry)
    }
  }
  requestAnimationFrame(retry)
}

function init() {
  if (controlsStarted) {
    startPage()
    return
  }
  controlsStarted = true

  startPage()

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== 'attributes' || mutation.attributeName !== 'data-processed') continue
      const target = mutation.target
      if (!(target instanceof HTMLElement) || !target.matches('pre.mermaid')) continue
      scheduleSync()
      return
    }
  })

  observer.observe(document.body, {
    subtree: true,
    attributes: true,
    attributeFilter: ['data-processed'],
  })

  const themeObserver = new MutationObserver(() => queueThemeRerender())
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  })

  document.addEventListener('astro:page-load', startPage)
  document.addEventListener('astro:after-swap', startPage)
  document.addEventListener('fullscreenchange', () => {
    for (const shell of document.querySelectorAll<HTMLElement>('.mermaid-shell')) {
      updateFullscreenButton(shell)
    }
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true })
}
else {
  init()
}
