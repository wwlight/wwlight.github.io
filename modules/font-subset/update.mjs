import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { PUBLISH_DIR, SUBSET_DIR } from './paths.mjs'
import { publishFontAssets } from './publish.ts'

const root = process.cwd()
const subsetDir = join(root, SUBSET_DIR)

function run(cmd, args, cwd = root) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd, stdio: 'inherit' })
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${cmd} ${args.join(' ')} exited ${code}`))
    })
  })
}

if (!existsSync(join(subsetDir, '.git'))) {
  throw new Error(`[fonts] ${SUBSET_DIR} is missing. Run git submodule update --init.`)
}

console.log('[fonts] split')
await run(process.execPath, ['modules/font-subset/worker.mjs'])
console.log('[fonts] publish')
publishFontAssets()
console.log('[fonts] copy')
await run('rsync', ['-a', '--delete', '--exclude', '.git', `${PUBLISH_DIR}/`, `${subsetDir}/`])
console.log('[fonts] push')
const next = `font-subset-${Date.now()}`
await run('git', ['checkout', '--orphan', next], subsetDir)
await run('git', ['add', '-A'], subsetDir)
await run('git', ['commit', '-m', 'chore(font-subset): publish subset files'], subsetDir)
await run('git', ['branch', '-M', 'font-subset'], subsetDir)
await run('git', ['push', '--force', 'origin', 'font-subset'], subsetDir)
console.log('[fonts] done')
