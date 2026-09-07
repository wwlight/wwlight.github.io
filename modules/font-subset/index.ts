import { defineNuxtModule } from '@nuxt/kit'
import { mkdirSync } from 'node:fs'
import { fork } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { PUBLISH_DIR } from './faces'
import { publishFontAssets } from './publish'

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

async function prepareAndPublish(): Promise<void> {
  await runWorker()
  publishFontAssets()
}

export default defineNuxtModule({
  meta: { name: 'font-subset' },
  setup(_, nuxt) {
    const prepared = prepareAndPublish()

    mkdirSync(PUBLISH_DIR, { recursive: true })
    nuxt.options.nitro.publicAssets ||= []
    nuxt.options.nitro.publicAssets.push({
      dir: PUBLISH_DIR,
      baseURL: 'font-subset'
    })

    nuxt.hook('nitro:config', async () => {
      await prepared
    })
    nuxt.hook('close', async () => {
      try { await prepared } catch (e) { console.error('[font-subset] prepare failed', e) }
    })
  }
})
