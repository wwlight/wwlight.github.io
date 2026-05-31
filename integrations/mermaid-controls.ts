import type { AstroIntegration, HookParameters } from 'astro'

/** astro-mermaid 渲染完成后，挂载缩放 / 平移 / 全屏工具栏 */
export function mermaidControls(): AstroIntegration {
  return {
    name: 'wwlight-mermaid-controls',
    hooks: {
      'astro:config:setup': ({ injectScript }: HookParameters<'astro:config:setup'>) => {
        injectScript('page', `import '/src/scripts/mermaid-controls.ts'`)
      },
    },
  }
}
