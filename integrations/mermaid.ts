import type { AstroIntegration, HookParameters } from 'astro'

/** Starlight 用 Expressive Code 渲染代码块，Mermaid 在客户端转换后按需加载 */
export function mermaid(): AstroIntegration {
  return {
    name: 'wwlight-mermaid',
    hooks: {
      'astro:config:setup': ({ injectScript }: HookParameters<'astro:config:setup'>) => {
        injectScript('page', `import '/src/scripts/mermaid-expressive.ts'`)
      },
    },
  }
}
