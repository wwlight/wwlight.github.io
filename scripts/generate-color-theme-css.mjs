import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildColorThemesCss, buildColorThemesJson, validateColorThemesCss } from './color-themes.data.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const css = buildColorThemesCss()
validateColorThemesCss(css)

writeFileSync(join(root, 'src/theme/styles/color-tokens.css'), css)
writeFileSync(join(root, 'src/theme/customizer/options.json'), buildColorThemesJson())

console.log('Generated src/theme/styles/color-tokens.css and src/theme/customizer/options.json')
