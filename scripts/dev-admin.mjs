#!/usr/bin/env node
import { ensureAdminEnv, loadEnvToProcess, startAstroDev } from './dev-bootstrap.mjs'

await ensureAdminEnv()
loadEnvToProcess()

startAstroDev({
  openPaths: ['/admin/bookmarks/'],
  labels: { '/admin/bookmarks/': '管理端已就绪: /admin/bookmarks/' },
})
