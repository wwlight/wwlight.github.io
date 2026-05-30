#!/usr/bin/env node
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const bin = path.join(root, 'node_modules', '.bin')
const env = {
  ...process.env,
  PATH: `${bin}${path.delimiter}${process.env.PATH ?? ''}`,
}

function start(command, args) {
  const child = spawn(command, args, {
    cwd: root,
    env,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })

  child.on('exit', (code, signal) => {
    if (signal)
      process.kill(process.pid, signal)
    else if (code)
      process.exit(code)
  })

  return child
}

const children = [
  start('astro', ['dev']),
  start('node', ['scripts/dev-admin.mjs']),
]

function shutdown() {
  for (const child of children)
    child.kill('SIGTERM')
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
