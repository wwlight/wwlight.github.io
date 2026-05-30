#!/usr/bin/env node
import { spawn, spawnSync } from 'node:child_process'
import crypto from 'node:crypto'
import fs from 'node:fs'
import net from 'node:net'
import path from 'node:path'
import { stdin as input, stdout as output } from 'node:process'
import readline from 'node:readline/promises'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const envPath = path.join(root, '.env')
const examplePath = path.join(root, '.env.example')
const adminPort = Number(process.env.BOOKMARKS_ADMIN_PORT) || 4325
const adminPath = '/admin/bookmarks/'

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

async function ensureAdminEnv() {
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

function loadEnvToProcess() {
  const hash = getAdminHash(readEnvFile())
  if (hash)
    process.env.PUBLIC_BOOKMARKS_ADMIN_HASH = hash
}

function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer()
    server.once('error', () => resolve(true))
    server.once('listening', () => {
      server.close(() => resolve(false))
    })
    server.listen(port, 'localhost')
  })
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function killPortProcesses(port) {
  spawnSync('sh', ['-c', `lsof -ti :${port} | xargs kill 2>/dev/null || true`], {
    stdio: 'ignore',
  })
}

async function ensurePortAvailable(port) {
  if (!(await isPortInUse(port)))
    return

  console.warn(`端口 ${port} 已被占用，正在结束旧 dev 进程…`)
  killPortProcesses(port)
  await sleep(400)

  if (await isPortInUse(port)) {
    console.error(`无法释放端口 ${port}，请手动结束进程后重试。`)
    console.error(`例如: lsof -ti :${port} | xargs kill`)
    process.exit(1)
  }
}

function openBrowser(url) {
  const platform = process.platform
  const command = platform === 'darwin' ? 'open' : platform === 'win32' ? 'start' : 'xdg-open'

  spawn(command, platform === 'win32' ? ['', url] : [url], {
    shell: platform === 'win32',
    detached: true,
    stdio: 'ignore',
  }).unref()
}

function startDevServer() {
  const astroBin = path.join(root, 'node_modules/.bin/astro')
  const child = spawn(astroBin, ['dev', '--port', String(adminPort)], {
    cwd: root,
    env: {
      ...process.env,
      BOOKMARKS_ADMIN_STRICT: '1',
    },
    stdio: ['inherit', 'pipe', 'inherit'],
  })

  let opened = false
  child.stdout?.on('data', (chunk) => {
    process.stdout.write(chunk)
    if (opened)
      return
    const text = chunk.toString()
    const portMatch = text.match(/Local\s+http:\/\/localhost:(\d+)/i)
    if (!portMatch && !/ready in/i.test(text))
      return

    opened = true
    const actualPort = portMatch ? Number(portMatch[1]) : adminPort
    const adminUrl = `http://localhost:${actualPort}${adminPath}`
    console.log(`\n管理端已就绪: ${adminUrl}\n`)
    openBrowser(adminUrl)
  })

  child.on('exit', (code) => {
    process.exit(code ?? 0)
  })
}

await ensureAdminEnv()
loadEnvToProcess()
await ensurePortAvailable(adminPort)

startDevServer()
