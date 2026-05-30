#!/usr/bin/env node
import { spawn } from 'node:child_process'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { stdin as input, stdout as output } from 'node:process'
import readline from 'node:readline/promises'
import { fileURLToPath } from 'node:url'
import { openBrowser, parseLocalDevUrl } from './open-browser.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const envPath = path.join(root, '.env')
const examplePath = path.join(root, '.env.example')

function readEnvFile() {
  if (!fs.existsSync(envPath))
    return ''
  return fs.readFileSync(envPath, 'utf-8')
}

function getAdminHash(content) {
  const match = content.match(/^PUBLIC_BOOKMARKS_ADMIN_HASH=(.+)$/m)
  return match?.[1]?.trim()
}

function upsertEnvHash(hash) {
  const content = readEnvFile()
  const next = /^PUBLIC_BOOKMARKS_ADMIN_HASH=/m.test(content)
    ? content.replace(/^PUBLIC_BOOKMARKS_ADMIN_HASH=.*$/m, `PUBLIC_BOOKMARKS_ADMIN_HASH=${hash}`)
    : `${content}${content && !content.endsWith('\n') ? '\n' : ''}PUBLIC_BOOKMARKS_ADMIN_HASH=${hash}\n`

  fs.writeFileSync(envPath, next, 'utf-8')
}

async function promptPassword() {
  const rl = readline.createInterface({ input, output })
  try {
    const password = await rl.question('首次启动，请设置管理端密码: ')
    if (!password.trim()) {
      console.error('密码不能为空')
      process.exit(1)
    }
    return password
  }
  finally {
    rl.close()
  }
}

function ensureEnvFile() {
  if (fs.existsSync(envPath) || !fs.existsSync(examplePath))
    return

  fs.copyFileSync(examplePath, envPath)
  console.log('已从 .env.example 创建 .env')
}

export async function ensureAdminEnv() {
  ensureEnvFile()

  let hash = getAdminHash(readEnvFile())
  if (hash)
    return hash

  console.log('未找到 PUBLIC_BOOKMARKS_ADMIN_HASH，将写入 .env')

  let password = process.env.BOOKMARKS_ADMIN_PASSWORD?.trim()
  if (!password) {
    if (!process.stdin.isTTY) {
      console.error('非交互环境请使用: BOOKMARKS_ADMIN_PASSWORD=你的密码 vpr dev:admin')
      process.exit(1)
    }
    password = await promptPassword()
  }

  hash = crypto.createHash('sha256').update(password).digest('hex')
  upsertEnvHash(hash)
  console.log('已写入 .env\n')
  return hash
}

export function loadEnvToProcess() {
  const hash = getAdminHash(readEnvFile())
  if (hash)
    process.env.PUBLIC_BOOKMARKS_ADMIN_HASH = hash
}

/**
 * @param {{ openPaths?: string[], labels?: Record<string, string> }} options
 * openPaths: 相对路径，如 ['/', '/admin/bookmarks/']
 */
export function startAstroDev({ openPaths = [], labels = {} } = {}) {
  const bin = path.join(root, 'node_modules', '.bin')
  const env = {
    ...process.env,
    PATH: `${bin}${path.delimiter}${process.env.PATH ?? ''}`,
  }
  const astroArgs = ['dev']
  const port = Number(process.env.PORT)
  if (port)
    astroArgs.push('--port', String(port))

  const child = spawn('astro', astroArgs, {
    cwd: root,
    env,
    stdio: ['inherit', 'pipe', 'inherit'],
    shell: process.platform === 'win32',
  })

  let opened = false
  let devLog = ''

  child.stdout?.on('data', (chunk) => {
    const text = chunk.toString()
    devLog += text
    process.stdout.write(text)
    if (opened)
      return
    if (!/ready in \d+/i.test(devLog) && !parseLocalDevUrl(devLog))
      return

    opened = true
    const base = (parseLocalDevUrl(devLog) ?? `http://localhost:${port || 4321}`).replace(/\/$/, '')

    for (const openPath of openPaths) {
      const url = `${base}${openPath.startsWith('/') ? openPath : `/${openPath}`}`
      const label = labels[openPath] ?? url
      console.log(`\n${label}\n`)
      openBrowser(url)
    }
  })

  child.on('exit', (code, signal) => {
    if (signal)
      process.kill(process.pid, signal)
    else
      process.exit(code ?? 0)
  })

  return child
}
