/// <reference types="astro/client" />
/// <reference path="../node_modules/@astrojs/starlight/virtual.d.ts" />
/// <reference path="../node_modules/@astrojs/starlight/virtual-internal.d.ts" />

declare module 'mermaid' {
  interface Mermaid {
    initialize: (config: { startOnLoad?: boolean; theme?: string }) => void
    render: (id: string, text: string) => Promise<{ svg: string }>
  }

  const mermaid: Mermaid
  export default mermaid
}
