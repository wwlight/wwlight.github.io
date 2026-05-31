import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildColorThemesCss, buildColorThemesJson, validateColorThemesCss } from './color-themes.data.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const css = buildColorThemesCss()
validateColorThemesCss(css)

writeFileSync(join(root, 'src/styles/color-themes.css'), css)
writeFileSync(join(root, 'src/lib/theme-options.json'), buildColorThemesJson())

console.log('Generated src/styles/color-themes.css and src/lib/theme-options.json')
