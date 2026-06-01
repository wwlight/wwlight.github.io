#!/usr/bin/env node
import { ensureAdminEnv, loadEnvToProcess, startAstroDev } from './dev-bootstrap.mjs'

await ensureAdminEnv()
loadEnvToProcess()

startAstroDev({
  openPaths: ['/', '/bookmarks/admin/'],
  labels: {
    '/': '主站已就绪',
    '/bookmarks/admin/': '管理端已就绪: /bookmarks/admin/',
  },
})
