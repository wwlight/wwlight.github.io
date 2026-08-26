import { defineNuxtModule } from '@nuxt/kit'
import { fork } from 'node:child_process'
import { fileURLToPath } from 'node:url'

// 准备完成的 Promise，provider（resolveFont 前）通过 globalThis 等待
export let FONTS_PREPARED: Promise<void> = Promise.resolve()

const READY_KEY = '__FONTSPLIT_READY__'

async function runWorker(): Promise<void> {
  const workerUrl = fileURLToPath(new URL('./worker.mjs', import.meta.url))
  const child = fork(workerUrl, [], { stdio: ['inherit', 'inherit', 'inherit', 'ipc'], execArgv: [] })
  await new Promise<void>((resolve, reject) => {
    child.on('message', (m) => { if ((m as any)?.kind === 'done') resolve() })
    child.on('error', reject)
    child.on('exit', (code) => { if (code !== 0) reject(new Error(`font-split worker exited ${code}`)) })
  })
  child.disconnect()
}

export default defineNuxtModule({
  meta: { name: 'font-subset' },
  setup(_, nuxt) {
    const prepared = runWorker()
    FONTS_PREPARED = prepared
    ;(globalThis as any)[READY_KEY] = prepared
    nuxt.hook('close', async () => {
      try { await prepared } catch (e) { console.error('[font-subset] prepare failed', e) }
    })
    nuxt.hook('fonts:providers' as any, async (providers: any) => {
      providers['local-split'] = (await import('./provider')).default
    })
  }
})