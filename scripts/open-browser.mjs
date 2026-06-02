import { execFileSync, spawn } from 'node:child_process'

function escapeAppleScriptString(value) {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

function urlMatchCondition(url) {
  const { origin, pathname } = new URL(url)
  const path = pathname.replace(/\/$/, '') || '/'

  if (path === '/')
    return `(URL of t) is "${escapeAppleScriptString(`${origin}/`)}" or (URL of t) is "${escapeAppleScriptString(origin)}"`

  return `(URL of t) starts with "${escapeAppleScriptString(`${origin}${path}`)}"`
}

function isUrlOpenInBrowser(url) {
  if (process.platform !== 'darwin')
    return false

  const match = urlMatchCondition(url)
  const script = `
set found to false
tell application "Google Chrome"
  if running then
    repeat with w in windows
      repeat with t in tabs of w
        if ${match} then
          set found to true
          exit repeat
        end if
      end repeat
      if found then exit repeat
    end repeat
  end if
end tell
if found then return "yes"
tell application "Safari"
  if running then
    repeat with w in windows
      repeat with t in tabs of w
        if ${match} then
          set found to true
          exit repeat
        end if
      end repeat
      if found then exit repeat
    end repeat
  end if
end tell
if found then return "yes"
return "no"
`.trim()

  try {
    const result = execFileSync('osascript', ['-e', script], {
      encoding: 'utf8',
      timeout: 3000,
    }).trim()
    return result === 'yes'
  }
  catch {
    return false
  }
}

export function openBrowser(url, { skipIfOpen = false } = {}) {
  if (skipIfOpen && isUrlOpenInBrowser(url)) {
    console.log(`\n已在浏览器打开，跳过: ${url}\n`)
    return
  }

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
