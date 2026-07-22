/**
 * 将页面上正在显示的 SVG 栅格化为 PNG 下载（浏览器内绘制，贴近所见即所得）。
 */
const DEFAULT_DOWNLOAD_NAME = '小鹤双拼.png'
const SVG_NS = 'http://www.w3.org/2000/svg'
const STYLE_PROPS = [
  'fill',
  'stroke',
  'color',
  'opacity',
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'letter-spacing',
  'stroke-width',
  'stroke-linecap',
  'stroke-linejoin',
  'dominant-baseline',
  'text-anchor',
] as const

function pageBackground(liveSvg: SVGSVGElement): string {
  const figure = liveSvg.closest('figure')
  if (figure) {
    const bg = getComputedStyle(figure).backgroundColor
    if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)')
      return bg
  }
  return getComputedStyle(document.body).backgroundColor || '#111'
}

/** 把 live 树上每个节点的计算样式写到 clone（保持 <use>+symbol 结构） */
function inlineComputedStyles(live: Element, clone: Element) {
  const inDefs = Boolean(live.closest('defs'))
  if (!inDefs) {
    const style = getComputedStyle(live)
    const parts: string[] = []
    for (const prop of STYLE_PROPS) {
      const value = style.getPropertyValue(prop)
      if (value)
        parts.push(`${prop}:${value}`)
    }
    if (parts.length)
      clone.setAttribute('style', parts.join(';'))
  }
  else if (live.tagName.toLowerCase() === 'path') {
    // symbol 内保留 currentColor，由各 <use> 的 color 决定
    const fill = live.getAttribute('fill')
    const stroke = live.getAttribute('stroke')
    if (fill)
      clone.setAttribute('fill', fill)
    if (stroke)
      clone.setAttribute('stroke', stroke)
    if (live.getAttribute('stroke-width'))
      clone.setAttribute('stroke-width', live.getAttribute('stroke-width')!)
    if (live.getAttribute('stroke-linecap'))
      clone.setAttribute('stroke-linecap', live.getAttribute('stroke-linecap')!)
    if (live.getAttribute('stroke-linejoin'))
      clone.setAttribute('stroke-linejoin', live.getAttribute('stroke-linejoin')!)
  }

  const liveChildren = [...live.children]
  const cloneChildren = [...clone.children]
  const n = Math.min(liveChildren.length, cloneChildren.length)
  for (let i = 0; i < n; i++)
    inlineComputedStyles(liveChildren[i]!, cloneChildren[i]!)
}

function freezeBrand(liveSvg: SVGSVGElement, cloneSvg: SVGSVGElement) {
  const liveFo = liveSvg.querySelector('foreignObject')
  const cloneFo = cloneSvg.querySelector('foreignObject')
  const btn = liveSvg.querySelector('[data-flypy-svg-download]')
  if (!liveFo || !cloneFo || !btn) {
    cloneFo?.remove()
    return
  }

  const x = Number(liveFo.getAttribute('x') || 0)
  const y = Number(liveFo.getAttribute('y') || 0)
  const size = Number(liveFo.getAttribute('width') || 0)
  const btnStyle = getComputedStyle(btn)
  const box = liveFo.getBoundingClientRect()
  const pxToUser = box.width > 0 ? size / box.width : 1
  const radius = (Number.parseFloat(btnStyle.borderRadius) || 6) * pxToUser
  const fontSize = (Number.parseFloat(btnStyle.fontSize) || 14) * pxToUser

  const g = document.createElementNS(SVG_NS, 'g')
  const rect = document.createElementNS(SVG_NS, 'rect')
  rect.setAttribute('x', String(x))
  rect.setAttribute('y', String(y))
  rect.setAttribute('width', String(size))
  rect.setAttribute('height', String(size))
  rect.setAttribute('rx', String(radius))
  rect.setAttribute('ry', String(radius))
  rect.setAttribute('fill', btnStyle.backgroundColor)
  g.appendChild(rect)

  const lines = (btn instanceof HTMLElement ? btn.innerText : btn.textContent || '')
    .split(/\n/)
    .map(s => s.trim())
    .filter(Boolean)
  const ratios = lines.length <= 1
    ? [0.52]
    : lines.map((_, i) => 0.38 + (0.24 * i) / Math.max(1, lines.length - 1))

  lines.forEach((label, i) => {
    const t = document.createElementNS(SVG_NS, 'text')
    t.setAttribute('x', String(x + size / 2))
    t.setAttribute('y', String(y + size * (ratios[i] ?? 0.52)))
    t.setAttribute('text-anchor', 'middle')
    t.setAttribute('dominant-baseline', 'middle')
    t.setAttribute('font-size', String(fontSize))
    t.setAttribute('font-weight', btnStyle.fontWeight)
    t.setAttribute('font-family', btnStyle.fontFamily)
    t.setAttribute('fill', btnStyle.color)
    t.textContent = label
    g.appendChild(t)
  })

  cloneFo.replaceWith(g)
}

function buildRasterSvg(liveSvg: SVGSVGElement, cssWidth: number, cssHeight: number): string {
  const clone = liveSvg.cloneNode(true) as SVGSVGElement
  clone.setAttribute('xmlns', SVG_NS)
  clone.setAttribute('width', String(cssWidth))
  clone.setAttribute('height', String(cssHeight))
  clone.removeAttribute('class')
  clone.removeAttribute('role')
  clone.removeAttribute('aria-label')

  inlineComputedStyles(liveSvg, clone)
  freezeBrand(liveSvg, clone)

  return `<?xml version="1.0" encoding="UTF-8"?>\n${new XMLSerializer().serializeToString(clone)}`
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('PNG 栅格化失败'))
    img.src = url
  })
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2))
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}

async function svgToPngBlob(liveSvg: SVGSVGElement): Promise<Blob> {
  await document.fonts.ready

  const figure = liveSvg.closest('figure')
  const figStyle = figure ? getComputedStyle(figure) : null
  const figRect = figure?.getBoundingClientRect() ?? liveSvg.getBoundingClientRect()
  const svgRect = liveSvg.getBoundingClientRect()

  const cssW = Math.max(1, figRect.width)
  const cssH = Math.max(1, figRect.height)
  const svgW = Math.max(1, svgRect.width)
  const svgH = Math.max(1, svgRect.height)
  const scale = Math.max(2, window.devicePixelRatio || 1)

  const radius = figStyle ? Number.parseFloat(figStyle.borderRadius) || 0 : 0
  const borderW = figStyle ? Number.parseFloat(figStyle.borderTopWidth) || 0 : 0
  const borderColor = figStyle?.borderTopColor || 'transparent'
  const bg = pageBackground(liveSvg)

  const svgText = buildRasterSvg(liveSvg, svgW, svgH)
  const url = URL.createObjectURL(new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' }))

  try {
    const img = await loadImage(url)
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(cssW * scale)
    canvas.height = Math.round(cssH * scale)
    const ctx = canvas.getContext('2d')
    if (!ctx)
      throw new Error('Canvas 不可用')

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.setTransform(scale, 0, 0, scale, 0, 0)

    // 圆角卡片：背景 + 内容，四角透明
    roundRect(ctx, 0, 0, cssW, cssH, radius)
    ctx.fillStyle = bg
    ctx.fill()

    ctx.save()
    roundRect(ctx, 0, 0, cssW, cssH, radius)
    ctx.clip()
    const dx = svgRect.left - figRect.left
    const dy = svgRect.top - figRect.top
    ctx.drawImage(img, dx, dy, svgW, svgH)
    ctx.restore()

    if (borderW > 0) {
      roundRect(
        ctx,
        borderW / 2,
        borderW / 2,
        cssW - borderW,
        cssH - borderW,
        Math.max(0, radius - borderW / 2),
      )
      ctx.strokeStyle = borderColor
      ctx.lineWidth = borderW
      ctx.stroke()
    }

    const blob = await new Promise<Blob | null>(resolve =>
      canvas.toBlob(resolve, 'image/png'),
    )
    if (!blob)
      throw new Error('toBlob 失败')
    return blob
  }
  finally {
    URL.revokeObjectURL(url)
  }
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function setupFlypySvgDownload() {
  document.querySelectorAll<HTMLElement>('[data-flypy-svg-download]').forEach((btn) => {
    if (btn.dataset.bound === '1')
      return
    btn.dataset.bound = '1'
    btn.addEventListener('click', () => {
      const svg = btn.closest('svg')
      if (!(svg instanceof SVGSVGElement))
        return
      const filename = btn.dataset.downloadName || DEFAULT_DOWNLOAD_NAME
      void svgToPngBlob(svg)
        .then(blob => triggerDownload(blob, filename))
        .catch((err) => {
          console.error(err)
        })
    })
  })
}
