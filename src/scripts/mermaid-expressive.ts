/** 从 Starlight Expressive Code 块还原 Mermaid 源码（保留换行） */
export function extractExpressiveMermaidDefinition(pre: HTMLElement): string {
  const code = pre.querySelector('code')

  if (code) {
    const ecLines = code.querySelectorAll('.ec-line')
    if (ecLines.length > 0) {
      return [...ecLines]
        .map(line => (line.textContent ?? '').replace(/\u00a0/g, ' ').replace(/\s+$/, ''))
        .join('\n')
        .trim()
    }
  }

  const copyCode = pre.closest('.expressive-code')?.querySelector('[data-code]')?.getAttribute('data-code')
  if (copyCode)
    return copyCode.replace(/\u007f\s*/g, '\n').trim()

  return (code ?? pre).textContent?.trim() ?? ''
}

export function convertExpressiveMermaidBlocks() {
  for (const block of document.querySelectorAll<HTMLElement>('.expressive-code pre[data-language="mermaid"]')) {
    const shell = block.closest('.expressive-code')
    if (!shell || shell.closest('.mermaid-shell'))
      continue

    const definition = extractExpressiveMermaidDefinition(block)
    if (!definition)
      continue

    const mermaidPre = document.createElement('pre')
    mermaidPre.className = 'mermaid'
    mermaidPre.textContent = definition
    shell.replaceWith(mermaidPre)
  }
}

let mermaidModulePromise: Promise<unknown> | null = null

function maybeLoadMermaidPage() {
  convertExpressiveMermaidBlocks()
  if (document.querySelector('pre.mermaid')) {
    mermaidModulePromise ??= import('./mermaid-controls.ts')
  }
}

maybeLoadMermaidPage()
document.addEventListener('astro:page-load', maybeLoadMermaidPage)
document.addEventListener('astro:after-swap', maybeLoadMermaidPage)
