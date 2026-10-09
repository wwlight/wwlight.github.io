import { defineNuxtModule } from '@nuxt/kit'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const SUBSET_DIR = 'vendor/font-subset'

export default defineNuxtModule({
  meta: { name: 'font-subset' },
  setup(_, nuxt) {
    const dir = join(nuxt.options.rootDir, SUBSET_DIR)
    if (!existsSync(join(dir, 'lxgw/regular/family.css'))) {
      throw new Error(`[font-subset] missing ${SUBSET_DIR}. Run git submodule update --init.`)
    }
    nuxt.options.nitro.publicAssets ||= []
    nuxt.options.nitro.publicAssets.push({
      dir,
      baseURL: 'font-subset',
    })
  },
})
