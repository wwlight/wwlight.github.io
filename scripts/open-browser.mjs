import { spawn } from 'node:child_process'

export function openBrowser(url) {
  const platform = process.platform
  const command = platform === 'darwin' ? 'open' : platform === 'win32' ? 'start' : 'xdg-open'

  spawn(command, platform === 'win32' ? ['', url] : [url], {
    shell: platform === 'win32',
    detached: true,
    stdio: 'ignore',
  }).unref()
}

export function parseLocalDevUrl(log) {
  const match = log.match(/Local\s+(http:\/\/localhost:\d+)/i)
  return match?.[1] ?? null
}
